const express = require('express');
const router = express.Router();
const MonthlyConsistency = require('../models/MonthlyConsistency');
const { protect } = require('../middleware/auth');

// @route   GET /api/consistency
// @desc    Get monthly consistency data for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = { userId: req.user._id };

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const consistency = await MonthlyConsistency.find(query).sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: consistency.length,
      data: { consistency },
    });
  } catch (error) {
    console.error('Get consistency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/consistency/stats
// @desc    Get overall statistics for logged in user
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const consistency = await MonthlyConsistency.find({ userId: req.user._id }).sort({
      year: -1,
      month: -1,
    });

    if (consistency.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalMonths: 0,
          averageCompletionRate: 0,
          totalTasks: 0,
          totalCompletedTasks: 0,
          longestStreak: 0,
          currentStreak: 0,
          monthlyData: [],
        },
      });
    }

    const totalTasks = consistency.reduce((sum, c) => sum + c.totalTasks, 0);
    const totalCompletedTasks = consistency.reduce((sum, c) => sum + c.completedTasks, 0);
    const averageCompletionRate =
      consistency.reduce((sum, c) => sum + c.completionRate, 0) / consistency.length;
    const longestStreak = Math.max(...consistency.map((c) => c.streak || 0));

    // Calculate current streak (consecutive months with activity)
    let currentStreak = 0;
    const now = new Date();
    let checkYear = now.getFullYear();
    let checkMonth = now.getMonth() + 1;

    for (let i = 0; i < 12; i++) {
      const record = consistency.find(
        (c) => c.year === checkYear && c.month === checkMonth
      );
      if (record && record.activeDays > 0) {
        currentStreak++;
        checkMonth--;
        if (checkMonth === 0) {
          checkMonth = 12;
          checkYear--;
        }
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalMonths: consistency.length,
        averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
        totalTasks,
        totalCompletedTasks,
        longestStreak,
        currentStreak,
        monthlyData: consistency,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/consistency/:year/:month
// @desc    Get specific month consistency data
// @access  Private
router.get('/:year/:month', protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12',
      });
    }

    const consistency = await MonthlyConsistency.findOne({
      userId: req.user._id,
      year,
      month,
    });

    if (!consistency) {
      return res.status(404).json({
        success: false,
        message: 'No data found for this month',
      });
    }

    res.status(200).json({
      success: true,
      data: { consistency },
    });
  } catch (error) {
    console.error('Get month consistency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
