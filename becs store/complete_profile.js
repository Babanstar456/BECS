const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database config — update these with your actual credentials
const db = {
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect'
};

// Log every request for easier debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /get-profile?email=...
app.get('/get-profile', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required.' });
  }

  try {
    const conn = await mysql.createConnection(db);
    const [rows] = await conn.execute(
      `SELECT 
         first_name AS firstName, 
         last_name AS lastName, 
         email_address AS email, 
         phone_number AS phone, 
         address_line_1 AS addressLine1,
         address_line_2 AS addressLine2,
         city, 
         state, 
         postal_code AS postalCode, 
         country, 
         bio
       FROM profiles
       WHERE email_address = ?`, 
      [email]
    );
    await conn.end();

    console.log('Fetched profile from DB:', rows[0]);

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Profile not found.' });
    }

    res.json({ status: 'success', profile: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Database error.' });
  }
});


// POST /complete-profile
app.post('/complete-profile', async (req, res) => {
  const {
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    bio
  } = req.body;

  if (!email || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
    return res.status(400).json({ status: 'error', message: 'All required fields must be filled.' });
  }

  try {
    const conn = await mysql.createConnection(db);
    const [rows] = await conn.execute(
  `SELECT 
     first_name, 
     last_name, 
     email_address AS email, 
     phone_number AS phone, 
     address_line_1 AS addressLine1,
     address_line_2 AS addressLine2,
     city, state, 
     postal_code AS postalCode, 
     country, bio
   FROM profiles
   WHERE email_address = ?`, 
  [email]
);


    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'No user updated. Email not found?' });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Update failed due to server error.' });
  }
});

// Start server
const PORT = 3002;
app.listen(PORT, () => console.log(`🚀 Complete profile backend running on port ${PORT}`));
