import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, editCourse, getCourseById, getCreatorCourses } from '../controllers/course.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route("/create").post(isAuthenticated, createCourse);

router.route("/creator-courses").get(isAuthenticated, getCreatorCourses);

router.route("/:courseId").put(isAuthenticated, upload.single('courseThumbnail'), editCourse);

router.route("/:courseId").get(isAuthenticated, getCourseById);

export default router;