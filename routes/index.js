
const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');

router.use('/user', require('./user'));
router.use('/task', auth, require('./task'));
module.exports = router;

