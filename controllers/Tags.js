const tags=require('../models/Tags');
const User = require('../models/User');

exports.createTag = async (req, res) => {
    try{

        const {name, description} = req.body;

        console.log(name, description);
        if(!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }
        const tagdetail=await tags.create({tagName: name, description});

        console.log(tagdetail);
        res.status(201).json({ message: 'Tag created successfully', tag: tagdetail });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// get all the tags

exports.showAllTags = async (req, res) => { 
    try{

        const taglist= await tags.find({},{tagName:true, description:true});
        if(taglist.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }
        res.status(200).json({ message: 'Tags retrieved successfully',taglist });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }   
};


exports.tagsPageDetails = async (req, res) => {
    try{
        
        const {tagId}=req.body;
        const selectedTag = await tags.findById(tagId).populate('courses', 'courseName courseDescription thumbnail price').exec();
        if(!selectedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        //fetch courses of other categories
        const otherTags = await tags.find({ _id: { $ne: tagId } }).populate('courses', 'courseName courseDescription thumbnail price').limit(5).exec();

        // top selling courses from the selected tag
        const topSellingCourses = await selectedTag.courses.sort((a, b) => b.enrollmentCount - a.enrollmentCount).slice(0, 5);
        if(topSellingCourses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this tag' });
        }
        res.status(200).json({ message: 'Tag details retrieved successfully', tag: selectedTag, otherTags , topSellingCourses });


    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }};