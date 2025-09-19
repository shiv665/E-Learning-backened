const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({

    tagName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    }],
   
});
module.exports = mongoose.model('Tags', TagsSchema);