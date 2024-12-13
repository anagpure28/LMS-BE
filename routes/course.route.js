import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, getCreatorCourses } from '../controllers/course.controller.js';

const router = express.Router();

router.route("/create").post(isAuthenticated, createCourse);

router.route("/creator-courses").get(isAuthenticated, getCreatorCourses);

export default router;