const RR= require('../models/RatingAndReview');
const Course = require('../models/Course');
const Mongoose = require('mongoose');

//creation of rating and review handle

exports.createRatingAndReview = async (req, res) => {
    try{

        const {courseId, rating, review}= req.body;
        const userId = req.user.id;
        // check if user is enrolled in the course and check if he already given a rating and review
        const courseDetails = await Course.findOne({_id: courseId, StudentsEnrolled: userId});

        if(!courseDetails) {
            return res.status(404).json({message: "You are not enrolled in this course or course not found"});
        }
        // check if user already given a rating and review
        const alreadyReviewed = await RR.findOne({user: userId, course: courseId});
        if(alreadyReviewed) {
            return res.status(400).json({message: "You have already given a rating and review for this course"});
        }
        //create new rating and review
        const newRatingAndReview = await RR.create({rating, review, user: userId, course: courseId});
        //update the course with the new rating and review
         
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    RatingAndReviews: newRatingAndReview._id
                }
            },
            {new: true}
        );
          
        return res.status(201).json({message: "Rating and review created successfully", data: newRatingAndReview});

    }catch(err) {
        return res.status(500).json({message: err.message || "Internal Server Error"});
    }};

    //get average rating handler

exports.getAverageRating = async (req, res) => {
    try{
        const courseId = req.body.courseId;

        const result = await RR.aggregate([{$match : {course: new Mongoose.Types.ObjectId(courseId)}},{ $group: { _id: null, averageRating: { $avg: "$rating" } } }]);
        if(result.length === 0) {
            return res.status(200).json({averageRating: 0});
        }
        const averageRating = result[0].averageRating;
        return res.status(200).json({averageRating: averageRating.toFixed(2)}); // Return average rating rounded to 2 decimal places



    }catch(err) {
        return res.status(500).json({message: err.message || "Internal Server Error"});
    }};
//get all rating and review handler

exports.getAllRatingAndReview= async (req, res) => {
    try{

        const allReview = await RR.find({}).sort({rating: 'desc'}).populate({path:'user', select:'firstName lastName email'}).populate({path:'course', select:'courseName'}).exec();
        return res.status(200).json({message: "All ratings and reviews fetched successfully", data: allReview});

    }catch(err) {
        return res.status(500).json({message: err.message || "Internal Server Error"});
    }};