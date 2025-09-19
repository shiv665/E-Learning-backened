const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    confirmPassword: {
        type: String,
        required: true,
        minlength: 6
    },

    

    accountType:{
        type: String,
        enum: ['admin', 'student', 'instructor'],
        required: true,
    },
    additionalDetails:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Profile', // Reference to another collection if needed
        default: null,
       
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Reference to the Course model
    }],
    image: {
        type: String,
        required: true,
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courseProgress' // Reference to the Course model
    }],
    token: {
        type: String,
        default: null
    },
    resetPasswordExpiryTime:{
        type: Date,
        default: Date.now()
    }


});
module.exports = mongoose.model('User', userSchema);