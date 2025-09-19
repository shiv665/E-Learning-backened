const express = require('express');
const router = express.Router();

const { getAllProfileData, updateProfile, deleteAccount, updateProfilePicture } = require('../controllers/Profile');
const {getUserDetails} = require('../controllers/GetUserDetails');
const { auth } = require('../middlewares/auth');

// Route to get all profile data
router.post('/getAllProfileData', auth, getAllProfileData);
// Route to update profile
router.put('/updateProfile', auth, updateProfile);
// Route to delete account
router.delete('/deleteAccount', auth, deleteAccount);
// Route to update profile picture
router.put('/updateProfilePicture', auth, updateProfilePicture);
// Route to get user details
router.post('/getUserDetails', auth, getUserDetails);

module.exports = router;