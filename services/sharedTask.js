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


async function findSharedTask(cond) {
    return await SharedTask.findOne(cond);
}


async function findAllSharedTasks(cond = {}) {
    return await SharedTask.find(cond);
}
function findSharedTasks(filter = {}) {
    return SharedTask.find(filter);
}

async function updateSharedTask(cond, updates) {
    const updatedSharedTask = await SharedTask.findOneAndUpdate(
        cond,
        updates,
        { new: true, runValidators: true }
    );
    return updatedSharedTask;
}

async function deleteSharedTask(cond) {
    return await SharedTask.findOneAndDelete(cond);
}


async function aggregateSharedTasks(pipeline = []) {
    return await SharedTask.aggregate(pipeline);
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

