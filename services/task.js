const { Task } = require('../models');



async function addTask(data) {
    const task = new Task(data);
    await task.save();
    return task;

}

async function findTask(cond) {
    return await Task.findOne(cond);
}


async function findAllTasks(cond = {}, skip, limit) {
    return await Task.find(cond);
}

async function findPaginatedTasks(cond = {}, skip = 0, limit = 5) {
  const tasksQuery = Task.find(cond).skip(skip).limit(limit);
  const countQuery = Task.countDocuments(cond);
  const [tasks, totalCount] = await Promise.all([tasksQuery, countQuery]);
  return [tasks, totalCount];
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


module.exports = { addTask, findTask, updateTask, findAllTasks, deleteTask, aggregateTasks, findPaginatedTasks }