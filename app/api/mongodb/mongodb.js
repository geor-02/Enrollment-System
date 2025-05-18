const mongoose = require('mongoose');

// Prevent multiple connections in development
const conn = mongoose.connection.readyState >= 1
  ? mongoose.connection
  : mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facultyDashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['faculty', 'admin', 'student'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = { User, Notification, Schedule, Task };