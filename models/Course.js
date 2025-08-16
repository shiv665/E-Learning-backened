const e = require('express');
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true
    },
    WhatUWillLearn: {
        type: String,
        required: true,
        trim: true
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section', // Reference to the Section model
        required: true
    }],
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price is non-negative
    },
    thumbnail: {
        type: String,
        required: true,
    },
    Instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    StudentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],
    RatingAndReviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview', // Reference to the RatingAndReview model
        required: true
    }],
    tags: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags' // Reference to the Tag model

    },
    status:{
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }


    
   
});
module.exports = mongoose.model('Course', CourseSchema);