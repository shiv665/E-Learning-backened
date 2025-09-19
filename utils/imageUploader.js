const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try{

        const options={folder};
        if (height){ options.height = height};
        if (quality) {options.quality = quality};
        options.resource_type = 'auto'; // Automatically determine resource type (image/video)
        return await cloudinary.uploader.upload(file.tempFilePath, options);


    }catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Image upload failed');
    }


};
exports.uploadVideoToCloudinary = async (file, folder, options = {}) => {
    try {
        const uploadOptions = {
            folder,
            resource_type: 'video',
            // Video-specific optimizations
            quality: options.quality || 'auto',
            format: options.format || 'mp4',
            // Compression settings for faster upload
            video_codec: options.codec || 'h264',
            audio_codec: 'aac',
            // Async processing to reduce wait time
            eager_async: true,
            // Generate thumbnails
            eager: [
                { 
                    width: 300, 
                    height: 200, 
                    crop: 'pad',
                    quality: 'auto',
                    format: 'jpg'
                }
            ],
            timeout: 300000, 
        };
        if (options.transformation) {
            uploadOptions.transformation = options.transformation;
        }

        console.log('Starting video upload to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
        console.log('Video upload completed:', uploadResult.public_id);
        
        return uploadResult;

    } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        throw new Error(`Video upload failed: ${error.message}`);
    }
};