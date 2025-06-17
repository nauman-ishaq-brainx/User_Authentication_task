const express = require('express');
const router = express.Router();
const isTaskOwner = require('../middleware/isTaskOwner');
const {sharedTaskController} = require('../controllers');
const isSharedTaskReceiver = require('../middleware/isSharedTaskReceiver')


router.post('/:id', isTaskOwner, sharedTaskController.shareTaskController);
router.patch('/accept/:id', isSharedTaskReceiver, sharedTaskController.acceptSharedTaskController);
router.patch('/reject/:id', isSharedTaskReceiver, sharedTaskController.rejectSharedTaskController);
router.delete('/:id', isSharedTaskReceiver, sharedTaskController.deleteSharedTaskAsReceiver);
router.get('/received', sharedTaskController.getReceivedSharedTasksController);
router.get('/sent', sharedTaskController.getSentSharedTasksController);
router.get('/accepted-tasks', sharedTaskController.getAcceptedSharedTasksController);


module.exports = router;