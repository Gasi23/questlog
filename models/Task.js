const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  
  // Task type
  type: {
    type: String,
    enum: ['daily', 'weekly', 'goal'],
    required: true
  },
  
  // Difficulty affects XP reward
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'epic'],
    default: 'medium'
  },
  
  // XP values by difficulty
  // easy: 10, medium: 25, hard: 50, epic: 100
  
  // Completion tracking
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  
  // For daily/weekly - reset tracking
  lastResetDate: { type: Date, default: Date.now },
  completionHistory: [{
    completedAt: Date,
    xpEarned: Number
  }],
  
  // For weekly tasks - which days
  daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sun, 6=Sat
  
  // Goal deadline
  dueDate: { type: Date },
  
  // Streak for dailies
  streak: { type: Number, default: 0 },
  
  // Visual
  icon: { type: String, default: '⚔️' },
  color: { type: String, default: '#6C63FF' },
  
  // Penalty if not done (for dailies)
  penaltyXP: { type: Number, default: 10 },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// XP reward by difficulty
taskSchema.statics.XP_REWARDS = {
  easy: 10,
  medium: 25,
  hard: 50,
  epic: 100
};

taskSchema.statics.PENALTY_XP = {
  easy: 5,
  medium: 10,
  hard: 20,
  epic: 35
};

// Check if daily needs reset
taskSchema.methods.needsReset = function() {
  if (this.type !== 'daily') return false;
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);
  return now.toDateString() !== lastReset.toDateString();
};

module.exports = mongoose.model('Task', taskSchema);
