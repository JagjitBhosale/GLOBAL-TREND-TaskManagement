const mongoose = require('mongoose');

const monthlyConsistencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2020, 'Year must be 2020 or later'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    inProgressTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    activeDays: {
      type: Number,
      default: 0,
      min: 0,
      max: 31,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique monthly records per user
monthlyConsistencySchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

// Index for efficient queries
monthlyConsistencySchema.index({ userId: 1, year: -1, month: -1 });

// Method to calculate completion rate
monthlyConsistencySchema.methods.calculateCompletionRate = function () {
  if (this.totalTasks === 0) {
    this.completionRate = 0;
  } else {
    this.completionRate = Math.round((this.completedTasks / this.totalTasks) * 100);
  }
};

// Update completion rate before saving
monthlyConsistencySchema.pre('save', function (next) {
  this.calculateCompletionRate();
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('MonthlyConsistency', monthlyConsistencySchema);
