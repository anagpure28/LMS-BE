import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/db.js';
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js';
import mediaRoute from './routes/media.route.js';

// The MaxListenersExceededWarning occurs when more than 10 event listeners are attached to an EventEmitter, which is the default maximum limit. This is a safety mechanism to warn about potential memory leaks. In your case, it seems related to the exit event listeners on a Bus object.
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 20; // Increase the limit as needed


dotenv.config(); // Load environment variables

// Establish database connection
connectDB().catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process if database connection fails
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173/',
    credentials: true
}));

// Middleware to handle user and course routes
app.use('/api/v1/media', mediaRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/course', courseRoute);

// Health check endpoint
app.get('/health-check', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'LMS Backend running successfully',
        });
    } catch (error) {
        console.error('Health check error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error occurred while running health check',
        });
    }
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err.message);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred on the server',
    });
});

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1); // Exit process if the server fails to start
    }
    console.log(`Server is running on port ${PORT}`);
});