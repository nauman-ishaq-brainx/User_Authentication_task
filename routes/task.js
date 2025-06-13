const express = require('express');
const router = express.Router();

const {taskController} = require('../controllers');


router.post('/', taskController.addTaskController);
router.get('/', taskController.getAllTasksController);
router.patch('/complete/:id', taskController.taskCompletedController);
router.delete('/:id', taskController.deleteTaskController);
router.patch('/not-complete/:id', taskController.taskNotCompletedController);
router.patch('/update-task-name/:id', taskController.updateTaskNameController)
module.exports = router;