const express = require('express');
const router = express.Router();
const canChangeTask = require('../middleware/canChangeTask');
const isTaskOwner = require('../middleware/isTaskOwner');
const {taskController} = require('../controllers');


router.post('/', taskController.addTaskController);
router.get('/',taskController.getPaginatedTasksController);
router.patch('/complete/:id', canChangeTask, taskController.taskCompletedController);
router.delete('/:id', isTaskOwner, taskController.deleteTaskController);
router.patch('/not-complete/:id', canChangeTask, taskController.taskNotCompletedController);
router.patch('/update-task-name/:id', canChangeTask, taskController.updateTaskNameController)
module.exports = router;