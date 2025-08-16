const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

    gender:{
        type: String
        

    },
    dateOfBirth: {
        type: Date,
        required: true,
        trim: true
    },
    about: {
        type: String,
        trim: true,
        maxlength: 500 
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true,
        // match: [/^\d{10}$/, 'Please enter a valid phone number'] 
    },
});
module.exports = mongoose.model('Profile', profileSchema);