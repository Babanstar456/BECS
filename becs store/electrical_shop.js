const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3005;

// Database connection config
const dbConfig = {
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect'
};

// 1️⃣ GET all electrical items
app.get('/api/electrical-items', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(`
      SELECT 
        PID AS id,
        name,
        category,
        price,
        imglink AS image,
        description,
        subcat,
        'Electrical' AS source
      FROM Electrical_Items
    `);
    await conn.end();
    res.json({ success: true, items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// 2️⃣ POST a new order
app.post('/api/place-order', async (req, res) => {
  const { email_id, pids } = req.body;
  if (!email_id || !Array.isArray(pids) || pids.length === 0 || pids.length > 10) {
    return res.status(400).json({ success: false, message: 'Invalid email or product IDs' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    // Pad to 10 PIDs with null
    const values = [email_id, ...pids, ...Array(10 - pids.length).fill(null)];

    await conn.execute(
      `INSERT INTO Orders (email_id, pid_1, pid_2, pid_3, pid_4, pid_5, pid_6, pid_7, pid_8, pid_9, pid_10)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    await conn.end();
    res.json({ success: true, message: 'Order saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Electrical shop backend listening on port ${PORT}`);
});
