const express = require('express');
const router = express.Router();

const { capturePayment, verifySignature,sendPaymentSuccessEmail } = require('../controllers/Payment');

const {auth, isAdmin, isInstructor, isStudent} = require('../middlewares/auth');
const { route } = require('./Courses');

router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/verifySignature',auth,isStudent,  verifySignature);
router.post('/sendPaymentSuccessEmail', auth, isStudent,sendPaymentSuccessEmail);

module.exports = router;