const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({

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
    message: {
        type: String,
        required: true,
        minlength: 6
    },
    countryCode:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true,
        // match: [/^\d{10}$/, 'Please enter a valid phone number'] 
    },
});
module.exports = mongoose.model('Contact', contactUsSchema);