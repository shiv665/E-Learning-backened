const mailSender= require('../utils/mailSender');
const { mongo, default: mongoose } = require('mongoose');
const contact = require('../models/ContactUs');
const {contactUsEmail} = require('../mail/templates/contactUsEmail');

exports.contactUs=async(req,res)=>{

    try{

        const {firstName, lastName='', email, message, countryCode, phone}=req.body;
        if (!firstName || !email || !message || !phone || !countryCode) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }
        const existing = await contact.findOne({ email });
            if (existing) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted this form.",
            });
            }

        const contactData = await contact.create({
                    firstName,
                    lastName,
                    email,
                    message,
                    countryCode,
                    phoneNumber: phone,
                });

        const emailcontent = await mailSender(email, "Contacting E learning", contactUsEmail(firstName, lastName, countryCode, phone, message));
        
        return res.status(200).json({
                success: true,
                message: "Message received. We will contact you shortly!",
            });



        

    }catch(err){
        console.error(err);
        return res.status(500).json({message: err.message});
    }

}