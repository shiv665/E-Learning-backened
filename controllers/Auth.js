// sendOTP , login , signup, change password , forgot password

const User = require('../models/User');

const OTP= require('../models/OTP');
const Profile = require('../models/Profile');

require('dotenv').config();

const otpgen=require('otp-generator');
const bcrypt = require('bcrypt');

const JWT= require('jsonwebtoken');
const { configDotenv } = require('dotenv');
const mailSender = require('../utils/mailSender');

exports.sendOTP= async (req, res) => {
    try{

        const {email}=req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ sucess: false, message: 'User already exists' });
        }
        const otp = otpgen.generate(6,
             { 
                upperCase: false, specialChars: false, alphabets: false
             });


        let result= await OTP.findOne({ otp: otp });

        while(result){
            otp = otpgen.generate(6, { 
                upperCase: false, specialChars: false, alphabets: false 
            });
            result = await OTP.findOne({ otp: otp });
        }


        const otpPayload={email, otp};

        //store in database
        const otpbody=  await OTP.findOneAndUpdate(
                { email },
                { otp, createdAt: Date.now() },
                { upsert: true, new: true }
            );
        await mailSender(email, "OTP verification", otp);


        res.status(200).json({ 
            success: true, message: 'OTP sent successfully'
         });


         

    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }

};


exports.signUp = async (req, res) => {

    try{

        const { 

            firstName, lastName, email, password, confirmPassword, accountType,  otp } = req.body;

         //validation

         if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({ success: false, message: 'All fields are required' });
         }

         if(password !== confirmPassword) {
            return res.status(403).json({ success: false, message: 'Passwords do not match' });
         }

         // if user already exists with same email address

         const existingUser= await User.findOne({ email });

         if(existingUser) {
            return res.status(401).json({ success: false, message: 'User already exists' });
         }

         // check if otp is valid

         const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);

         if(!recentOTP || recentOTP.length==0){
            return res.status(403).json({ success: false, message: 'OTP not found' });
         }
         else if(recentOTP.otp !== otp) {
            return res.status(403).json({ success: false, message: 'Invalid OTP' });
         }

         // create user by hashing the password

         const hashedPassword = await bcrypt.hash(password,10);

         //create additional details for user

         const additionalDetails = await Profile.create({
            gender: "null", dateOfBirth:"00", about:"..", phoneNumber:"null "

         });

         const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword, 
            accountType,
            additionalDetails: additionalDetails._id, 
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}_${lastName}` // Assuming a default image path
         });

         await mailSender(email,"Registration Sucessfull",`Congrats ${firstName}, you have successfully registered for e-learning platform`);

         return res.status(201).json({ 
            success: true, 
            message: 'User created successfully', 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
                image: user.image
            } 
         });


    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', error: err.message });
    }

};

exports.login= async (req, res) => {
    try{

        const { email, password } = req.body;
        // validate it
        if(!email || !password) {
            return res.status(403).json({ success: false, message: 'All fields are required' });
        }
        // check if user exists
        const existingUser= await User.findOne({ email }).populate('additionalDetails');
        if(!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }
        // CHECK IF PASSWORD IS CORRECT

        if(await bcrypt.compare(password, existingUser.password)){
            const payload={
                email: existingUser.email,
                id: existingUser._id,
                accountType: existingUser.accountType,
             };
            const token= await JWT.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: '12h'
                }
            )

            existingUser.token=token;
            existingUser.password=undefined; // to not send password in response

            const options = {
                httpOnly: true, 
                expires: new Date(Date.now() + 3600000)
            }; 


            res.cookie('token', token, options).status (200).json({ success: true, message: 'Login successful', existingUser, token });

        }
        else{
            res.status(400).json({success:false, message:'Password do not match'});
        }



    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    //get data from request body
    //get oldpassword and new password and confirm password
    //validation
    //update password in database
    //send mail
    //return response
    // try {
    //     const { oldPassword, newPassword, confirmPassword } = req.body;
    //     const userId = req.user.id; // Assuming user ID is available in req.user

    //     if (!oldPassword || !newPassword || !confirmPassword) {
    //         return res.status(403).json({ success: false, message: 'All fields are required' });
    //     }

    //     if (newPassword !== confirmPassword) {
    //         return res.status(403).json({ success: false, message: 'Passwords do not match' });
    //     }

    //     const user = await User.findById(userId);
    //     if (!user) {
    //         return res.status(404).json({ success: false, message: 'User not found' });
    //     }

    //     const isMatch = await bcrypt.compare(oldPassword, user.password);
    //     if (!isMatch) {
    //         return res.status(403).json({ success: false, message: 'Old password is incorrect' });
    //     }

    //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    //     user.password = hashedNewPassword;
    //     await user.save();

    //     res.status(200).json({ success: true, message: 'Password changed successfully' });

    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }

};