const express= require('express');
const router= express.Router();

const{createCourse, getAllCourses, getCourseDetails, getAllCoursesByInstructor, getAllCoursesofStudentEnrolled} = require('../controllers/Course');
const {createTag, showAllTags, tagsPageDetails} = require('../controllers/Tags');

const {createSection, updateSection, deleteSection, getSectionDetails} = require('../controllers/Section');

const {createSubSection, updateSubSection, deleteSubSection} = require('../controllers/subSection');

const {createRatingAndReview, getAverageRating, getAllRatingAndReview} = require('../controllers/RatingAndReview');

const {auth, isInstructor, isStudent, isAdmin} = require('../middlewares/auth');

router.post('/createCourse', auth, isInstructor, createCourse);

router.post('/addSection', auth, isInstructor, createSection);

router.post('/updateSection', auth, isInstructor, updateSection);

router.delete('/deleteSection', auth, isInstructor, deleteSection);
router.post('/getSectionDetails', auth, getSectionDetails);

// subsection routes
router.post('/addSubSection', auth, isInstructor, createSubSection);
router.post('/updateSubSection', auth, isInstructor, updateSubSection);
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);

//get all courses
router.post('/getAllCourses', getAllCourses);
router.post('/getCourseDetails', auth, getCourseDetails); //for specific course
router.post('/getAllCoursesByInstructor', auth, isInstructor, getAllCoursesByInstructor);
router.post('/getAllOfStudentEnrolled', auth, isStudent, getAllCoursesofStudentEnrolled );

//tag rooutes
router.post('/createTag', auth, isAdmin, createTag);
router.get('/showAllTags', showAllTags);
router.post('/tagsPageDetails', auth, tagsPageDetails);

//rating and review routes
router.post('/createRatingAndReview', auth, isStudent, createRatingAndReview);
router.post('/getAverageRating', getAverageRating);
router.post('/getAllRatingAndReview', auth, getAllRatingAndReview);

module.exports = router;