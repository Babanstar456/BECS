const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const timeout = require('connect-timeout');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(timeout('15s')); // 15 seconds timeout for API
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// ✅ MySQL Pool with Timeout Settings
const pool = mysql.createPool({
  host: '217.21.84.52',
  user: 'u617065149_BECS',
  password: 'Becs@2k24',
  database: 'u617065149_BECS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,   // 10s to connect
  acquireTimeout: 10000,   // 10s to acquire connection from pool
  timeout: 10000           // 10s general timeout
});

// ✅ Test connection once at server start
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Connection Pool Error:', err);
  } else {
    console.log('✅ Connected to MySQL (via pool)');
    connection.release();
  }
});

// ✅ API Endpoint
app.get('/api/courses', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Connection error:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }

    connection.query(
      'SELECT course_id, course_name, course_description, price, image_link FROM courses',
      (queryErr, results) => {
        connection.release(); // always release after query
        if (queryErr) {
          console.error('Query error:', queryErr);
          return res.status(500).json({ error: 'Database query failed' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
      }
    );
  });
});

// ✅ Start Server with keepAlive settings
const PORT = 3008;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ Prevent Node from closing idle connections too early
server.keepAliveTimeout = 65000;  // 65s
server.headersTimeout = 66000;    // 66s
