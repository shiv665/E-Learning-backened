const User = require('../models/User');
const Profile = require('../models/Profile');

exports.getUserDetails = async (req, res) => {  
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'UserId missing' });
        }

        const user = await User.findById(userId).populate('additionalDetails');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send user details
        return res.status(200).json({ success: true, data: user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
