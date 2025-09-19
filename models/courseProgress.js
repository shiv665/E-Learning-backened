const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({

    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', 
        required: true
    },
    completedVideos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subSection', // Reference to the Video model
    }]

    

});
module.exports = mongoose.model('courseProgress', courseProgressSchema);