const {Task} = require('../models');



async function addTask(data){
    const task = new Task(data);
    await task.save();
    return task;

}

async function findTask(cond) {
    return await Task.findOne(cond);
}


async function findAllTasks(cond = {}) {
    return await Task.find(cond);
}

async function updateTask(cond, updates) {
    const updatedTask = await Task.findOneAndUpdate(
        cond,
        updates,
        { new: true, runValidators: true }
    );
    return updatedTask;
}
async function deleteTask(cond) {
    return await Task.findOneAndDelete(cond);
}

async function aggregateTasks(pipeline = []) {

    return await Task.aggregate(pipeline);
}


module.exports = { addTask, findTask, updateTask, findAllTasks, deleteTask, aggregateTasks }