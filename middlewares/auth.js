// auth isStudent isInstructor isAdmin

const jwt= require('jsonwebtoken');

require('dotenv').config();

const user= require('../models/User');

exports.auth = async (req, res, next) => {
    try{

        const token= req.cookies.token|| req.body.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }

        try{
            const decode= await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            next();

        }catch(err){
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }


    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'student'){
            return res.status(403).json({ success: false, message: 'Access denied. Not a student.' });
        }
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'instructor'){
            return res.status(403).json({ success: false, message: 'Access denied. Not an instructor.' });
        }
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'admin'){
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};