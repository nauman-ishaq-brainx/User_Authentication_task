const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {userController} = require('../controllers/index')




router.get('/all', auth, userController.getAllUsers)
router.post('/signup', userController.signUpController);
router.post('/login', userController.logInController);
router.post('/verify/:token', userController.emailVerificationController);
router.patch('/change_password', auth, userController.changePasswordController);
router.post('/forgot_password/:email', userController.forgotPasswordController);
router.post('/reset_password', userController.resetPasswordController);




module.exports = router;