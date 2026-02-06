const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const MonthlyConsistency = require('../models/MonthlyConsistency');
const { protect } = require('../middleware/auth');

// Helper function to update monthly consistency
const updateMonthlyConsistency = async (userId) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed

    // Get task counts for current month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const tasks = await Task.find({
      userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

    // Get unique active days
    const activeDaysSet = new Set();
    tasks.forEach((task) => {
      const day = new Date(task.createdAt).getDate();
      activeDaysSet.add(day);
    });
    const activeDays = activeDaysSet.size;

    // Update or create monthly consistency record
    await MonthlyConsistency.findOneAndUpdate(
      { userId, year, month },
      {
        userId,
        year,
        month,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        activeDays,
        lastActiveDate: now,
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating monthly consistency:', error);
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    const query = { userId: req.user._id };

    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title',
      });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description: description || '',
      status: status || 'pending',
    });

    // Update monthly consistency
    await updateMonthlyConsistency(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    let task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    // Update monthly consistency
    await updateMonthlyConsistency(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update monthly consistency
    await updateMonthlyConsistency(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
