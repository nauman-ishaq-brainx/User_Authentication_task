const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {taskController} = require('../controllers');


router.post('/', auth, taskController.addTaskController);
router.get('/', auth, taskController.getAllTasksController);
router.patch('/complete/:id', auth, taskController.taskCompletedController);
router.delete('/:id', auth, taskController.deleteTaskController);


module.exports = router;