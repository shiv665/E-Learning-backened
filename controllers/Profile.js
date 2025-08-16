const profile=require('../models/Profile');
const user=require('../models/User');
const course=require('../models/Course');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

exports.updateProfile = async (req, res) => {
    try{
        const{dateOfBirth="", about="", phoneNumber,gender}=req.body;
        const userId = req.user.id;
        
        if(!phoneNumber||!gender){
            return res.status(400).json({message: "Please provide all required fields"});
        }
        const userDetails= await user.findById(userId);
        console.log(userDetails);
        const additionalId=userDetails.additionalDetails._id;
        console.log(additionalId);
        const additionaldetails= await profile.findById(additionalId);

        
        
        if (!additionaldetails) {
            return res.status(404).json({ message: "Profile details not found for the user" });
        }

        additionaldetails.dateOfBirth = dateOfBirth;
        additionaldetails.about = about;
        additionaldetails.phoneNumber = phoneNumber;
        additionaldetails.gender=gender;
        await additionaldetails.save();

        return res.status(200).json({message: "Profile updated successfully", profile: additionaldetails});


    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }};


exports.deleteAccount = async (req, res) => {
    try{
        

        const id=req.user.id;
        // Find the user by ID
        const userDetails = await user.findById(id);
        if(!userDetails){
            return res.status(404).json({message: "User not found"});
        }
        await profile.findByIdAndDelete(userDetails.additionalDetails);
        await user.findByIdAndDelete(id);
        // Delete the user's courses this can be also included in the user model

        return res.status(200).json({message: "Account deleted successfully"});


    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};


exports.getAllProfileData = async (req, res) => {
    try{
        const id = req.user.id;
        const userDetails = await user.findById(id).populate('additionalDetails').exec();

        return res.status(200).json({
            message: "Profile data retrieved successfully",
            profile: userDetails
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};


// update the profile picture ///check this as error is {
//     "message": "Cannot read properties of undefined (reading 'profilePhoto')"
// }
exports.updateProfilePicture = async (req, res) => {
    try{

        const userId = req.user.id;

        const photo = req.files.profilePhoto;
        if(!photo){
            return res.status(400).json({message: "Please provide a profile photo"});
        }
        const userDetails = await user.findById(userId);
        if(!userDetails){
            return res.status(404).json({message: "User not found"});
        }
        const image = await uploadImageToCloudinary(photo, process.env.FOLDER_NAME);

        const updatedUser = await user.findByIdAndUpdate(userId, {
            image: image.secure_url
        }, { new: true });


        return res.status(200).json({
            message: "Profile picture updated successfully",
            profile: updatedUser
        });

    }catch(err){
        console.log(err.message);
        return res.status(500).json({message: err.message});
    }
};

