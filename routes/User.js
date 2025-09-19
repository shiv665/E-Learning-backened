const express = require('express');
const router = express.Router();

const{login, signUp, sendOTP, changePassword}= require('../controllers/Auth');

// reset pasword

const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword');

const {auth} = require('../middlewares/auth');
const {contactUs} =require('../controllers/ContactUs');

// router for auth controller
router.post('/contactUs', contactUs);
router.post('/login', login);
router.post('/signUp', signUp);
router.post('/sendOTP', sendOTP);
router.post('/changePassword', auth, changePassword);

// reset password routes
router.post('/resetPasswordToken', resetPasswordToken);
router.post('/resetPassword', resetPassword);

module.exports = router;