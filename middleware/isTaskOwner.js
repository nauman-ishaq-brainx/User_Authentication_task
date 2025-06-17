const { taskService } = require('../services');
const mongoose = require('mongoose');

async function isTaskOwner(req, res, next) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await taskService.findTask({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(403).json({ error: 'You do not own this task' });
    }

    // Task exists and belongs to the user
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = isTaskOwner;
