const mongoose = require('mongoose');
const { sharedTaskService, taskService, userService } = require('../services');
const { sendEmail } = require('../utils/emailSender');
// Share a task with another user
async function shareTaskController(req, res) {
  try {
    const { receiverEmail } = req.body;
    const taskId = req.params.id;
    if (!receiverEmail || !taskId) {
      return res.status(400).json({ error: 'Receiver email and Task ID are required.' });
    }
    

    // Check if task exists and belongs to sender
    const task = await taskService.findTask({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not owned by you.' });
    }

    // Find receiver by email
    const receiver = await userService.findUser({ email: receiverEmail.toLowerCase().trim() });
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found.' });
    }
    if (receiver._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot share a task with yourself.' });
    }

    // Check if already shared
    const alreadyShared = await sharedTaskService.findSharedTask({
      taskId,
      sender: req.user.id,
      receiver: receiver._id,
      status: 'pending'
      
    });
    if (alreadyShared) {
      return res.status(409).json({ error: 'Task already shared with this user.' });
    }

    const sharedTask = await sharedTaskService.addSharedTask({
      taskId,
      sender: req.user.id,
      receiver: receiver._id,
    });
    await sendEmail({
                to: receiverEmail,
                subject: `${req.user.email} shared a task : ${task.name}`,
                html:  `<p>Please visit your dashboard to see the task.</p>`,
            });

    res.status(201).json({ message: 'Task shared successfully.', sharedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Accept shared task for collaboration
async function acceptSharedTaskController(req, res) {
  try {
    const id = req.params.id;

    const sharedTask = await sharedTaskService.findSharedTask({ _id: id, receiver: req.user.id });
    if (!sharedTask) return res.status(404).json({ error: "Shared task not found" });

    if (sharedTask.status === 'accepted') {
      return res.status(400).json({ error: "Task already accepted" });
    }

    await sharedTaskService.updateSharedTask({ _id: id }, { status: 'accepted' });
    const sender = await userService.findUser({_id:sharedTask.sender
    })
    const task = await taskService.findTask({_id: sharedTask.taskId})

    await sendEmail({
                to: sender.email,
                subject: `${req.user.email} accepted your task`,
                html:  `<p>Your task ${task.name} has been accepted by ${req.user.name}</p>`,
            });

    res.status(200).json({ message: "Task accepted for collaboration", taskId: sharedTask.taskId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Reject shared task
async function rejectSharedTaskController(req, res) {
  try {

    const id = req.params.id;

    const sharedTask = await sharedTaskService.findSharedTask({ _id: id, receiver: req.user.id });
    if (!sharedTask) return res.status(404).json({ error: "Shared task not found" });

    await sharedTaskService.updateSharedTask({ _id: id }, { status: 'rejected' });
    const task = await taskService.findTask({_id: sharedTask.taskId})
    const sender = await userService.findUser({_id: sharedTask.sender})
    await sendEmail({
                to: sender.email,
                subject: `${req.user.email} rejected your task`,
                html:  `<p>Your task "${task.name}" has been rejected by ${req.user.name}<p>`,
            });

    res.status(200).json({ message: "Task rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getAcceptedSharedTasksController = async (req, res) => {
  try {
    const sharedTasks = await sharedTaskService
      .findSharedTasks({ receiver: req.user._id, status: "accepted" })
      .populate("taskId", "name isCompleted dueDate")
      .populate("sender", "email")
      .sort({ createdAt: -1 });

    res.json({ sharedTasks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accepted shared tasks" });
  }
};



const getReceivedSharedTasksController = async (req, res) => {
  try {
    const sharedTasks = await sharedTaskService
      .findSharedTasks({ receiver: req.user._id, status: 'pending' })
      .populate("taskId", "name")
      .populate("sender", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({ sharedTasks });
  } catch (error) {

    res.status(500).json({ error: "Server error while fetching shared tasks" });
  }
};


// Get shared tasks sent by the user
async function getSentSharedTasksController(req, res) {
  try {
    const sharedTasks = await sharedTaskService.findAllSharedTasks({ sender: req.user.id });
    res.status(200).json({ sharedTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSharedTaskAsReceiver = async (req, res) => {
  try {
    const sharedTaskId = req.params.id;

    const deleted = await sharedTaskService.deleteSharedTask({ _id: sharedTaskId });

    if (!deleted) {
      return res.status(404).json({ error: 'Shared task not found or already deleted' });
    }

    return res.status(200).json({ message: 'Shared task entry deleted for this collaborator.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  shareTaskController,
  acceptSharedTaskController,
  rejectSharedTaskController,
  getReceivedSharedTasksController,
  getSentSharedTasksController,
  deleteSharedTaskAsReceiver,
  getAcceptedSharedTasksController
};
