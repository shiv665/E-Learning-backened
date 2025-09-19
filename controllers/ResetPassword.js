// resetPasswordToken

const User=require('../models/User');
const bcrypt = require('bcrypt');

const crypto = require('crypto');

const mailSender= require('../utils/mailSender');
const { mongo, default: mongoose } = require('mongoose');

exports.resetPasswordToken = async (req, res) => {
    try{

        const {email}= req.body;

        const user= await User.findOne({email});

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        // Generate a reset password token
        const token= crypto.randomUUID();

        const uri= `http://localhost:5173/resetPassword/token?token=${token}&email=${email}`;

        const updateDetails = await User.findOneAndUpdate({email},{
            token: token,
            resetPasswordExpiryTime: Date.now() + 5*60000 
        },{new: true});

        await mailSender(
            email,
            'Reset Password',
            `Click on the link to reset your password: ${uri}`
        );
        return res.status(200).json({message: 'Reset password link sent to your email', uri});

    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
};

//resetPassword

exports.resetPassword= async (req, res) => {
    try{

        const {token, password, confirmPassword}= req.body;
        
        

        if(password !== confirmPassword){
            return res.status(400).json({message: 'Passwords do not match'});
        }

        const user = await User.findOne({token: token});

        console.log(user);

        if(!user){
            return res.status(404).json({message: 'Invalid LINK '});
        }

        if(user.resetPasswordExpiryTime < Date.now()){
            return res.status(400).json({message: 'Token expired'});
        }
        const hashedPassword= await bcrypt.hash(password, 10);

        const updateDetails = await User.findOneAndUpdate({token},{
            password: hashedPassword,
            confirmPassword: hashedPassword,
            token: null,
            resetPasswordExpiryTime: Date.now() // Reset the expiry time
        },{new: true});
        res.status(200).json({message: 'Password reset successfully'});


    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }
};