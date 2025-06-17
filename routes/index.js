
const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');

router.use('/users', require('./user'));
router.use('/tasks', auth, require('./task'));
router.use('/share-task', auth, require('./sharedTask'))
module.exports = router;

