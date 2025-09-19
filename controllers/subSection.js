const section = require("../models/Section");
const course = require("../models/Course");
const subSection = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {uploadVideoToCloudinary} = require("../utils/imageUploader");




// creation, updation, and deletion of sub-section handler
exports.createSubSection = async (req, res) => {
    try{

        //fetch the data  and video file
        const {title, timeDuration, description, sectionId} = req.body;
        const videoFile = req.files.videoFile; // Assuming video file is sent in the request
        // vallidation of the data
        if(!title || !timeDuration || !description || !sectionId || !videoFile) {
            return res.status(400).json({message: "Please provide all required fields"});
        }
        //upload video to cloudinary
        const videoUpload= await uploadVideoToCloudinary(videoFile, process.env.FOLDER_NAME);
        //create a subSection 
        const subsection= await subSection.create({
            title,
            timeDuration,
            description,
            videoURL: videoUpload.secure_url,
        });

        // update the section Schema with new subsection id
        const updatedSection= await section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSections: subsection._id
                }
            }

        );

        //return the response

        return res.status(201).json({
            message: "Sub-section created successfully",
            subsection: subsection,
            section: updatedSection
        },{new: true});
        //can use populate to get the section details if needed as it will show only the subsection id in section schema

    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:  err.message});
    }};

exports.updateSubSection = async (req, res) => {
    try{
        const{subSectionId, title, timeDuration, description} = req.body;
        if(!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({message: "Please provide all required fields"});
        }
        //find the subsection by id and update it
        const updatedSubSection = await subSection.findByIdAndUpdate(subSectionId, 
            {title, timeDuration, description}, {new: true});
        return res.status(200).json({
            message: "Sub-section updated successfully",
            subsection: updatedSubSection,
            success: true,
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }};

exports.deleteSubSection = async (req, res) => {
    try{

        const{subSectionId} = req.params;
        
        await subSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({message: "Sub-section deleted successfully"});

    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }};