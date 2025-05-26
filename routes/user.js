const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {signUpController, logInController, emailVerificationController, changePasswordController, forgotPasswordController, resetPasswordController} = require('../controllers/user');



router.post('/signup', signUpController);
router.post('/login', logInController);
router.post('/verify', emailVerificationController);
router.post('/change_password', auth, changePasswordController);
router.post('/forgot_password/', forgotPasswordController);
router.post('/reset_password/', resetPasswordController);



module.exports = router;