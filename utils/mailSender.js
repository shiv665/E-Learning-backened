const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, otp)=>{

    try{

        const transporter= nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info= await transporter.sendMail({
            from: `"Course Management System" <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`, // list of receivers
            subject: ` ${title}`, // Subject line
            html: `<b> ${otp}</b>`, // html body
        });

        console.log("Message sent: %s", info);
        return info;



    }
    catch(err){
        console.error("Error in mailSender:", err);
        throw new Error("Failed to send email");
    }

};
module.exports = mailSender;