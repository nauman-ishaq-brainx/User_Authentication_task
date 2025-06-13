const { default: mongoose } = require('mongoose');
const { taskService } = require('../services');


async function addTaskController(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name of the task is required' })
        };
        const task = await taskService.addTask({ name, user: req.user.id });
        return res.status(201).json({ message: "Your task has been successfully added" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }

}

async function updateTaskNameController(req, res) {
    try {
        const taskId = req.params.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Task name is required" });
        }

        const updatedTask = await taskService.updateTask(
            { _id: new mongoose.Types.ObjectId(taskId), user: req.user.id },
            { name }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({ message: "Task name updated successfully", task: updatedTask });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function getAllTasksController(req, res) {
    try {
        const tasks = await taskService.findAllTasks({ user: req.user.id });
        return res.status(200).json({tasks});
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }

}

async function taskCompletedController(req, res) {
    try {
        const taskId = req.params.id;
        
        const updatedTask = await taskService.updateTask({ _id: new mongoose.Types.ObjectId(taskId) , user: req.user.id }, { isCompleted: true });
        if (!updatedTask){
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({message: 'Task has been marked as completed'});

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

async function taskNotCompletedController(req, res) {
    try {
        const taskId = req.params.id;
        
        const updatedTask = await taskService.updateTask({ _id: new mongoose.Types.ObjectId(taskId) , user: req.user.id }, { isCompleted: false });
        if (!updatedTask){
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({message: 'Task has been marked as not completed completed'});

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}


async function deleteTaskController(req, res){
    try {
       const taskId = req.params.id;
    const deletedTask = await taskService.deleteTask({_id: taskId});
    if (!deletedTask){
        return res.status(404).json('Task not found');
    }
    return res.status(200).json({message: 'Task has been deleted successfully', deletedTask});
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
    
}


module.exports = {updateTaskNameController, addTaskController, taskNotCompletedController, getAllTasksController, taskCompletedController,deleteTaskController }