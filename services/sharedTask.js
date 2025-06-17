const { SharedTask } = require('../models');

// Add a new shared task (invitation)
async function addSharedTask(data) {
    const sharedTask = new SharedTask(data);
    await sharedTask.save();
    return sharedTask;
}

async function deleteSharedTask(condition) {
  return await SharedTask.findOneAndDelete(condition);
}

// Find one shared task by condition
async function findSharedTask(cond) {
    return await SharedTask.findOne(cond);
}

// Get all shared tasks by condition
async function findAllSharedTasks(cond = {}) {
    return await SharedTask.find(cond);
}

// Update shared task (e.g., to accept or reject)
async function updateSharedTask(cond, updates) {
    const updatedSharedTask = await SharedTask.findOneAndUpdate(
        cond,
        updates,
        { new: true, runValidators: true }
    );
    return updatedSharedTask;
}

// Delete a shared task (e.g., retract invitation)
async function deleteSharedTask(cond) {
    return await SharedTask.findOneAndDelete(cond);
}

// Aggregate shared tasks (e.g., notifications, reports)
async function aggregateSharedTasks(pipeline = []) {
    return await SharedTask.aggregate(pipeline);
}

function findSharedTasks(filter = {}) {
  return SharedTask.find(filter); // Do NOT use .exec() or .lean() here
}

module.exports = {
    addSharedTask,
    findSharedTask,
    findAllSharedTasks,
    updateSharedTask,
    deleteSharedTask,
    aggregateSharedTasks,
    deleteSharedTask,
    findSharedTasks
};

