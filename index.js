const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/User');
const courseRoutes = require('./routes/Courses');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const {cloudinaryConnect} = require('./config/cloudinary');

const fileUpload = require('express-fileupload');

database.connect()
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://shivansh3286.me/", // Replace with your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

cloudinaryConnect();

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to the E-Learning Platform API'
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
