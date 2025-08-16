const mongoose=require('mongoose');
const mailSender=require('../utils/mailSender');

const OTPSchema=new mongoose.Schema([{
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        
    }
}]);

async function sendOTP(email, otp){
    try {
        await mailSender(email, "OTP verification", otp);
        console.log('OTP sent successfully');
    } 
    catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}


OTPSchema.pre('save', async function(next) {
    await sendOTP(this.email, this.otp);
    next();
});





module.exports = mongoose.model('OTP', OTPSchema);