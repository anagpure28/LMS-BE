import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse } from '../controllers/course.controller.js';

const router = express.Router();

router.route("/create-course").post(isAuthenticated, createCourse);

export default router;