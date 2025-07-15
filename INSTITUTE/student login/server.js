const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({
    status: 'live',
    message: '🔥 BECS Backend is Live!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString()
  };
  res.json(healthcheck);
});

// Firebase Admin Initialization
try {
  const serviceAccount = require('./firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://becs-370ab.firebaseio.com"
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

// MySQL Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '217.21.84.52',
  user: process.env.DB_USER || 'u617065149_BECS',
  password: process.env.DB_PASS || 'Becs@2k24',
  database: process.env.DB_NAME || 'u617065149_BECS',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ MySQL connection failed:', error);
    process.exit(1);
  });

// Firebase authentication middleware
async function authenticateFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      console.warn('❌ No token provided');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authentication token provided',
        timestamp: new Date().toISOString()
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    console.log(`✅ Authenticated user: ${decodedToken.uid}`);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid or expired authentication token',
      timestamp: new Date().toISOString()
    });
  }
}

// ✅ Public endpoint - All courses
app.get('/api/courses', async (req, res, next) => {
  try {
    const [results] = await pool.query(`
      SELECT course_id, course_name, course_description, price, image_link FROM courses
    `);
    res.json({
      status: 'success',
      count: results.length,
      courses: results,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Protected route - Purchased courses for logged-in user
app.get('/api/user/:uid/courses', authenticateFirebaseToken, (req, res, next) => {
  handleCoursesRequest(req, res).catch(next);
});

async function handleCoursesRequest(req, res) {
  const { uid } = req.params;

  if (uid !== req.user.uid) {
    console.warn(`❌ UID mismatch: requested(${uid}) vs authenticated(${req.user.uid})`);
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'You can only access your own courses',
      timestamp: new Date().toISOString()
    });
  }

  const [results] = await pool.query(`
    SELECT 
      c.course_id,
      c.course_name,
      c.course_description,
      c.price,
      c.image_link,
      pc.purchased_at
    FROM purchased_courses pc
    JOIN courses c ON pc.course_id = c.course_id
    WHERE pc.firebase_uid = ?
  `, [uid]);

  console.log(`✅ Retrieved ${results.length} course(s) for user ${uid}`);
  res.json({ 
    status: 'success',
    count: results.length,
    courses: results,
    timestamp: new Date().toISOString()
  });
}

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    details: err.message,
    timestamp: new Date().toISOString()
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3007;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ Server error handler
server.on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});
