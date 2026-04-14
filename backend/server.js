require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ❌ COMENTA ISSO POR ENQUANTO
// const authRoutes = require('./routes/auth');
// const taskRoutes = require('./routes/tasks');
// const userRoutes = require('./routes/users');
// const leaderboardRoutes = require('./routes/leaderboard');

const app = express();

app.use(cors());
app.use(express.json());

// ❌ COMENTA ISSO TAMBÉM
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', message: 'QuestLog API running' })
);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/questlog';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 QuestLog API running on port ${PORT}`));