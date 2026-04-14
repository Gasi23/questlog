const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'warrior' }, // warrior, mage, rogue, paladin
  
  // Gamification
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalXpEarned: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  
  // Stats
  tasksCompleted: { type: Number, default: 0 },
  dailiesCompleted: { type: Number, default: 0 },
  weekliesCompleted: { type: Number, default: 0 },
  goalsCompleted: { type: Number, default: 0 },
  
  // Social
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Achievements
  badges: [{
    id: String,
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level from XP
// Level formula: level = floor(sqrt(xp / 100)) + 1
userSchema.methods.calculateLevel = function() {
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

// XP needed for next level
userSchema.statics.xpForLevel = function(level) {
  return Math.pow(level, 2) * 100;
};

// Add XP and handle level up
userSchema.methods.addXP = async function(amount) {
  this.xp += amount;
  this.totalXpEarned += amount;
  const newLevel = this.calculateLevel();
  const leveledUp = newLevel > this.level;
  this.level = newLevel;
  await this.save();
  return { leveledUp, newLevel, xp: this.xp };
};

// Deduct XP (penalty)
userSchema.methods.deductXP = async function(amount) {
  this.xp = Math.max(0, this.xp - amount);
  this.level = this.calculateLevel();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
