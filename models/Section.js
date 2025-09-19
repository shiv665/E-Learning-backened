const mongoose = require('mongoose');
const subSection = require('./subSection');

const SectionSchema = new mongoose.Schema({

    sectionName: {
        type: String,
    },
    subSections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subSection', // Reference to the subSection model
        required: true
    }],
   
});
module.exports = mongoose.model('Section', SectionSchema);