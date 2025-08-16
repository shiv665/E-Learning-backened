const User= require('../models/User');
const Course = require('../models/Course');
const mailsender= require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseRegistration');
const {instance}=require('../config/razorpay');
const { default: mongoose } = require('mongoose');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
require('dotenv').config();
//capture the payment and initiate the course order

exports.capturePayment = async (req, res) => {
        const {courses}= req.body;
        const userId=req.user.id;
        console.log("User ID:", userId);
        console.log("Courses:", courses);
    try{

       

        if(courses.length === 0){
            return res.status(400).json({message: "Please provide at least one course ID"});
        }
        let totalAmount = 0;
        for(const course_id of courses){
            let course;
            try{
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(404).json({message: `Course  not found`});
                }
                const uid = new mongoose.Types.ObjectId(userId);
                if(course.StudentsEnrolled.includes(uid)){
                    return res.status(400).json({message: `You are already enrolled in the course `});
                }
                totalAmount += course.price; 
            }catch(err){
                return res.status(404).json({message: err.message || "Course not found"});
            }}
            
            const options={
                amount: totalAmount * 100, 
                currency: 'INR',
                receipt: `${userId}_${Date.now()}`,
            }
            console.log("Razorpay Options:", options);
            try{
                const paymentResponse = await instance.orders.create(options);
                if(!paymentResponse || !paymentResponse.id){
                    return res.status(500).json({message: "Failed to create payment order"});
                }
                return res.status(200).json({
                    success: true,
                    amount: paymentResponse.amount / 100, // Convert back to rupees
                    currency: paymentResponse.currency,
                    orderId: paymentResponse.id,
                    courses: courses
                });
            }catch(err){
                console.error(err);
                return res.status(500).json({message: err.message || "could not initiate order"});
            }
    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }
};

exports.verifySignature = async (req, res) => {
    try{
        const courses=req.body?.courses;
        const userId=req.user.id;
        const razorpay_order_id=req.body?.razorpay_order_id;
        const razorpay_payment_id=req.body?.razorpay_payment_id;
        const razorpay_signature=req.body?.razorpay_signature;
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(400).json({message: "Payment failed"});
        }
        let body=razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({message: "Invalid signature"});
        }
        //ENROLL THE USER IN THE COURSES
        await EnrollStudentInCourses(courses, userId,res);


    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message || "Internal server error while verifying payment signature"});
    }};

const EnrollStudentInCourses = async (courses, userId, res) => {
    try{
        if(!courses || !userId){
            return res.status(400).json({message: "please provide all details"});
        }
        
        const enrolledCourses = [];
        for(const course_id of courses){
            const EnrolledCourse= await Course.findOneAndUpdate({_id: course_id},
                {
                    $push: {
                        StudentsEnrolled: userId
                    }
                }, {new: true}
            );
            if(!EnrolledCourse){
                return res.status(404).json({message: `Course  not found`});
            }
            const enrolledStudent= await User.findOneAndUpdate({_id: userId}, {
                $push: {
                    courses: course_id
                }
            }, {new: true});

            const emailContent = await mailSender(enrolledStudent.email, "Course Enrollment Confirmation", courseEnrollmentEmail(EnrolledCourse.courseName,enrolledStudent.firstName, EnrolledCourse.Instructor.firstName));
        }
        return res.status(200).json({message: "Successfully enrolled in courses"});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error while enrolling in courses"});
    }

};

exports.sendPaymentSuccessEmail = async (req, res) => {
    try{

        const {orderId, amount, courses} = req.body;    

        const userId = req.user.id;
        if(!orderId || !amount || !courses || !userId){
            return res.status(400).json({message: "Please provide all required details"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        await mailSender(user.email, "Payment Success", `Your payment of ₹${amount} for order ID ${orderId} has been successfully processed. Thank you for your purchase!`);

    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error while sending payment success email"});
    }
};
















//these are correct but still commented out beacause it includes the payment of single course and if i store the items in cart then it will be a different logic
// exports.capturePayment = async (req, res) => {
//     try{

//         //get course id and user id
//         const {course_Id} = req.body;
//         const userId=req.User.id;
//         //validation
//         if(!course_Id){
//             return res.status(400).json({message: "Please provide course ID"});
//         }
//         //valid courseID
//         //valid course details
//         let course;
//         try{
//             course = await Course.findById(course_Id);
//             if(!course){
//                 return res.status(404).json({message: "Course not found"});
//             }
//             const uid = new mongoose.Types.ObjectId(userId);
//             //check if user is already enrolled in the course
//             if(course.StudentsEnrolled.includes(uid)){
//                 return res.status(400).json({message: "You are already enrolled in this course"});
//             }


//         }catch(err){
//             return res.status(404).json({message: err.message || "Course not found"});
//         }
//         //create order 
//         const amount = course.price * 100; // Convert to paise
//         const currency = 'INR'; 
//         const options = {
//             amount: amount, // Amount in paise
//             currency: currency,
//             receipt: `receipt_${course_Id}_${userId}`, // Unique receipt ID
//             notes: {
//                 courseId: course_Id,
//                 userId: userId
//             }
//         };

//         // initialize razorpay instance
//         try{
//             const PaymentResponse = await instance.orders.create(options);
//             return res.status(200).json({
//                 sucess: true,
//                 courseName: course.courseName,
//                 courseId: course_Id,
//                 amount: PaymentResponse.amount / 100, // Convert back to rupees and add additional information about the course such as thumbnail and description
//                 currency: PaymentResponse.currency,
//             });

//         }catch(err){
//             return res.status(500).json({message: "Error initializing Razorpay instance"});
//         }
//         //return the response

//     }catch(err){
//         console.error(err);
//         return res.status(500).json({message: "Internal server error"});
//     }};


// exports.verifySignature = async (req, res) => {
//     try{
        
//         const webhookSecret = "9532472127";
//         const signature = req.headers['x-razorpay-signature'];

//         const shasum = crypto.createHmac('sha256', webhookSecret);  ///from documentation of razorpay trying to encrypt and verify the  signature
//         shasum.update(JSON.stringify(req.body));
//         const generatedSignature = shasum.digest('hex');

//         if(generatedSignature === signature){

//             const {courseId, userId} = req.body.payload.payment.entity.notes;
//             try{
//                 const enrolledCourse = await Course.findOneAndUpdate({_id: courseId},
//                     {
//                         $push: {
//                             StudentsEnrolled: userId
//                         }
//                     }, {new: true}
//                 );
//                 if(!enrolledCourse){
//                     return res.status(404).json({message: "Course not found"});
//                 }
//                 const enrolledStudent= await User.findOneAndUpdate({_id: userId},{
//                     $push: {
//                           courses: courseId
//                     }
//                 }, {new: true});
//                 //sending the email

//                 const emailcontent = await mailSender(enrolledStudent.email, "Course Enrollment Confirmation", courseEnrollmentEmail(enrolledCourse.courseName, enrolledCourse.courseDescription, enrolledCourse.thumbnail));

//                 return res.status(200).json({
//                     message: "Payment verified and course enrollment successful",
//                     course: enrolledCourse,
//                     student: enrolledStudent,
//                     emailContent: emailcontent
//                 });


//             }catch(err){
//                 return res.status(404).json({message: "Course not found"});
//             }
//         }
//         else {
//             return res.status(400).json({message: "Invalid signature"});
//         }


//     }catch(err){
//         console.error(err);
//         return res.status(500).json({message: "Internal server error"});
//     }};