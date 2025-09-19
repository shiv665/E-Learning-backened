const mongoose = require('mongoose');

const RatingAndReviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5 // Maximum rating
    },
    review: {
        type: String,
        required: true,
        trim: true
    },

    
   
});
module.exports = mongoose.model('RatingAndReview', RatingAndReviewSchema);