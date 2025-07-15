const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection config
const dbConfig = {
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect'
};

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// POST /login
app.post('/login', async (req, res) => {
  console.log('➡️  Received /login request');
  console.log('Request Body:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({
      status: 'error',
      message: 'Email and Password are required.'
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL');

    // Fetch user record
    const [rows] = await connection.execute(
      'SELECT first_name, last_name, password FROM profiles WHERE email_address = ?',
      [email]
    );

    await connection.end();
    console.log('✅ Query executed. Rows:', rows);

    if (rows.length === 0) {
      console.log('⚠️  Email not found');
      return res.status(200).json({ status: 'not_found' });
    }

    const user = rows[0];
    console.log('✅ User found:', user);

    if (user.password !== password) {
      console.log('❌ Incorrect password');
      return res.status(200).json({ status: 'wrong_password' });
    }

    // Successful login
    console.log('✅ Successful login for:', email);

    return res.status(200).json({
      status: 'success',
      email,
      firstName: user.first_name,
      lastName: user.last_name
    });

  } catch (err) {
    console.error('💥 Error during login:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error.'
    });
  }
});

// POST /admin-login
app.post('/admin-login', async (req, res) => {
  console.log('➡️  Received /admin-login request');
  console.log('Request Body:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL');

    const [rows] = await conn.execute(
      `SELECT Admin_email_id, Admin_password FROM Admin WHERE Admin_email_id = ?`,
      [email]
    );

    await conn.end();
    console.log('✅ Query executed. Rows:', rows);

    if (rows.length === 0) {
      console.log('⚠️  Admin email not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const admin = rows[0];
    if (admin.Admin_password !== password) {
      console.log('❌ Incorrect admin password');
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    console.log('✅ Successful admin login for:', email);
    res.json({ success: true });
  } catch (err) {
    console.error('💥 Error during admin login:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
