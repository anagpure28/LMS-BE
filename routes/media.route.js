import express from 'express';
import fs from 'fs';
import upload from '../utils/multer.js';
import { uploadMedia } from '../utils/cloudinary.js';

const router = express.Router();

router.route('/upload-video').post(upload.single('file'), async (req, res) => {
    try {
        // Upload the file to Cloudinary
        const result = await uploadMedia(req.file.path);

        // Delete the file from the uploads folder after uploading to cloudinary
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error while deleting the file:', err);
            } else {
                console.log('File deleted successfully from uploads folder');
            }
        });

        // Send the response
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
        });
    }
});

export default router;
