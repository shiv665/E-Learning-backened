const user= require('../models/User');
const course = require('../models/Course');
const tag = require('../models/Tags');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

//creation of course handler

exports.createCourse = async (req, res) => {

    try{

        //fetch data
        //get thumbnail image
        // validate data
        // validatiion of instructor
        const {courseName, courseDescription, WhatUWillLearn, price, tags} = req.body;
        const thumbnail = req.files.thumbnail;  /////check for it throufh schema confusion
        console.log("courseName:", courseName);
        console.log("courseDescription:", courseDescription);
        console.log("WhatUWillLearn:", WhatUWillLearn);
        console.log("price:", price);
        console.log("tags:", tags);
        console.log("thumbnail:", thumbnail);


        if(!courseName || !courseDescription || !WhatUWillLearn || !price || !thumbnail || !tags){
            return res.status(400).json({message: "Please provide all required fields"});
        }

        // Check if the instructor exists
        const userId = req.user.id; 

        const instructorDetails = await user.findById(userId);
        
        if(!instructorDetails){
            return res.status(404).json({message: "Instructor not found"});
        }

        // Check if the tag exists
        const tagDetails = await tag.findById(tags);
      
        if(!tagDetails){
            return res.status(404).json({message: "Tag not found"});
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        
        //creation of newcourse
        const newCourse = new course({
            courseName,
            courseDescription,
            WhatUWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            Instructor: instructorDetails._id,
            tags: tagDetails._id
        });
        await course.create(newCourse);
       const updatedU= await user.findByIdAndUpdate({_id: instructorDetails._id},
             {
                $push:
                 {
                    courses: newCourse._id
                }},{new: true });

        console.log(updatedU);

                //update the tag schema
           const updatedTag = await tag.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {new: true}
        );

        res.status(201).json({
            message: "Course created successfully",
            course: newCourse
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }

};


//getting of all the courses


exports.getAllCourses = async (req, res) => {
    try{

        //at last we will execote and understand this doubt how in course creatione RatingAndReviews came as earlier we haven't made entry in course creation

        const courses = await course.find({},{
            courseName: 1,
            price: 1,
            thumbnail: 1,
            Instructor: 1,
            StudentsEnrolled: 1,
            RatingAndReviews: 1,
            tags: 1,
        }).populate('Instructor').populate('tags').exec();

        res.status(200).json({
            message: "Courses fetched successfully",
            courses: courses
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }
};


exports.getCourseDetails = async (req, res) => {
    try{
        const {courseId} = req.body;

        if(!courseId){
            return res.status(400).json({message: "Please provide course ID"});
        }

        const courseDetails = await course.findById(courseId).populate({
            path: 'Instructor',
            populate:{
                path: 'additionalDetails',
            }
        }).populate('tags').populate('RatingAndReviews').populate({
            path: 'courseContent',
            populate:{
                path: 'subSections'
            }
        }).exec(); // here some issue is there with the courseContent and section and subsection during population

        if(!courseDetails){
            return res.status(404).json({message: "Course not found"});
        }

        return res.status(200).json({
            message: "Course details fetched successfully",
            courseDetails: courseDetails
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }};

exports.getAllCoursesByInstructor = async (req, res) => {
    try{
        const {instructorId} = req.body;
        if(!instructorId){
            return res.status(400).json({message: "Please provide instructor ID"});
        }
        const instructorCourses = await course.find({Instructor: instructorId}).populate('Instructor').populate('StudentsEnrolled').exec();
        if(!instructorCourses || instructorCourses.length === 0){
            return res.status(404).json({message: "No courses found for this instructor"});
        }
        return res.status(200).json({
            message: "Courses fetched successfully",
            courses: instructorCourses
        });
        
    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }};

exports.getAllCoursesofStudentEnrolled = async (req, res) => {
    try{
        const {studentId} = req.body;
        if(!studentId){
            return res.status(400).json({message: "Please provide student ID"});
        }
        const studentCourses = await user.findById(studentId).populate({
            path: 'courses',
            populate:{
                path: 'Instructor'
            }
        }).exec();
        if(!studentCourses || studentCourses.courses.length === 0){
            return res.status(404).json({message: "No courses found for this student"});
        }
        return res.status(200).json({
            message: "Courses fetched successfully",
            courses: studentCourses.courses
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }};