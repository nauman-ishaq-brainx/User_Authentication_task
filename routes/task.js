const express = require('express');
const router = express.Router();

const {taskController} = require('../controllers');


router.post('/', taskController.addTaskController);
router.get('/', taskController.getAllTasksController);
router.patch('/complete/:id', taskController.taskCompletedController);
router.delete('/:id', taskController.deleteTaskController);

module.exports = router;