const { sharedTaskService } = require('../services');

async function isSharedTaskReceiver(req, res, next) {
  try {
    const sharedTaskId = req.params.id;

    const sharedTask = await sharedTaskService.findSharedTask({ _id: sharedTaskId });
    if (!sharedTask) {
      return res.status(404).json({ error: 'Shared task not found' });
    }

    // Only receiver can accept/reject the shared task
    if (sharedTask.receiver.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the receiver can respond to this invitation.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = isSharedTaskReceiver;
