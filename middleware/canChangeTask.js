const { Task, SharedTask } = require('../models');
const { taskService } = require('../services');


async function canChangeTask(req, res, next) {
  const taskId = req.params.id;
  const userId = req.user.id;
  try {
    const task = await taskService.findTask({_id:taskId});
    if (!task) return res.status(404).json({ error: "Task not found" });

    const isOwner = task.user.toString() === userId;
    if (isOwner) {
      req.task = task;
      return next();
    }

    const sharedAccess = await SharedTask.findOne({
      taskId,
      receiver: userId,
      status: 'accepted'
    });

    if (sharedAccess) {
      req.task = task;
      return next();
    }

    return res.status(403).json({ error: "You don't have permission to access this task" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = canChangeTask;
