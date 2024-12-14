import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCourse = async(req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: 'Course Title and Category not found.'
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })

        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
        }); 
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator: userId});
        if(!courses){
            return res.status(400).json({
                success: false,
                message: "Course not found",
                course: []
            }); 
        }
        return res.status(200).json({
            success: true,
            message: "Courses found successfully",
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
        });  
    }
}

export const editCourse = async (req, res) => {
    try {
      const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
      const thumbnail = req.file;
      const { courseId } = req.params;
  
      console.log({ courseId, body: req.body, file: req.file });
  
      let course = await Course.findById(courseId);
      console.log(courseId, course, course._id)
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      let courseThumbnail = course.courseThumbnail;
      if (thumbnail) {
        if (courseThumbnail) {
          const publicId = courseThumbnail.split("/").pop().split(".")[0];
          console.log("Deleting thumbnail:", publicId);
          await deleteMediaFromCloudinary(publicId);
        }
        const uploadResult = await uploadMedia(thumbnail.path);
        courseThumbnail = uploadResult.secure_url;

        // Construct the file path using the filename and delete it from the 'uploads' folder
        const filePath = path.join(
          __dirname,
          "../uploads",
          thumbnail.filename
        );
        await fs.unlink(filePath);
      }
  
      const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail };
      course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
  
      return res.status(200).json({ course, message: "Course updated successfully" });
    } catch (error) {
      console.error("Error in editCourse:", error);

      // Cleanup uploaded file on error
      if (req.file) {
        const fallbackFilePath = path.join(
          __dirname,
          "../uploads",
          req.file.filename
        );
        await fs
          .unlink(fallbackFilePath)
          .catch((unlinkError) =>
            console.error("Failed to delete file:", unlinkError)
          );
      }
      
      return res.status(500).json({ message: "Failed to update course" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course found successfully",
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
        });
    }
}