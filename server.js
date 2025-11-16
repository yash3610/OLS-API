import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';  // ✅ ADD THIS IMPORT
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import lectureRoutes from './routes/lecture.routes.js';
import userRoutes from './routes/user.routes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware - CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',  // ✅ CHANGED: Allow all origins for now
  credentials: true
}));

// ✅ INCREASE PAYLOAD SIZE LIMIT (for image uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/users', userRoutes);

// Health check route - ✅ FIXED: Use import instead of require
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: 'MongoDB Atlas',
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 10000,
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ideamagix API Server',
    version: '1.0.0',
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      lectures: '/api/lectures',
      users: '/api/users'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.path} not found`,
    availableRoutes: [
      '/api/health',
      '/api/auth',
      '/api/courses',
      '/api/lectures',
      '/api/users'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'File size too large. Maximum allowed size is 50MB.',
      error: 'PAYLOAD_TOO_LARGE'
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 10000;  // ✅ CHANGED: Default to 10000 for Render

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Ideamagix Server Started`);
  console.log('='.repeat(50));
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`💾 Database: MongoDB Atlas`);
  console.log(`📦 Max Upload Size: 50MB`);
  console.log(`🔗 CORS Origin: ${process.env.FRONTEND_URL || '*'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50) + '\n');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error(`❌ Server error: ${error.message}`);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;