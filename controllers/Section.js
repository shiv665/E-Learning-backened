const courses=require('../models/Course');
const section=require('../models/Section');

// creation , updation and deletion of section handler

exports.createSection = async (req, res) => {
    try{

        const {sectionName, courseId}=req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({message: "Please provide all required fields"});
        }
        const newSection= await section.create({sectionName});
        const courseDetails = await courses.findByIdAndUpdate(courseId,{
            $push: {
                courseContent: newSection._id
            }
        }, {new: true});
        if(!courseDetails){
            return res.status(404).json({message: "Course not found"});
        }
        return res.status(201).json({message: "Section created successfully"});


    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }
};


exports.updateSection = async (req, res) => {
    try{

        const {sectionId, sectionName}=req.body;
        if(!sectionId || !sectionName){
            return res.status(400).json({message: "Please provide all required fields"});
        }
        //find the section by id and update it
        const updateSection= await section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        return res.status(200).json({
            message: "Section updated successfully",
            sucess: true,
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};


exports.deleteSection = async (req, res) => {
    try{

        const {sectionId}=req.params;
        //find the section by id
        await section.findByIdAndDelete(sectionId);
        // do we need to update the course schema as well?
        await courses.updateMany(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } }
        );
        return res.status(200).json({message: "Section deleted successfully"});


    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};

exports.getSectionDetails = async (req, res) => {
    try{

        const {courseId}=req.body;
        if(!courseId){
            return res.status(400).json({message: "Please provide section id"});
        }
        //find the section by id
        const sectionDetails= await courses.findById(courseId).populate({
            path: 'courseContent',
            populate:{
                path: 'subSections'
            }
        });
            
        if(!sectionDetails){
            return res.status(404).json({message: "Section not found"});
        }
        return res.status(200).json({
            message: "Section details fetched successfully",
            sectionDetails,
        })
    } 
    catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};