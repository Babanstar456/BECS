// electronicsServer.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection config - replace these with your real credentials
const db = mysql.createConnection({
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect'
});

// Test connection
db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// GET all Electronics Items
app.get('/api/electronics', (req, res) => {
  const sql = 'SELECT * FROM Electronics_Items';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Electronics_Items:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Add "source" field as "Electronics" to match frontend
    const products = results.map(item => ({
      id: item.PID,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.imglink,
      description: item.description,
      subcat: item.subcat,
      source: 'Electronics'
    }));

    console.log('Mapped products:', products);

    res.json(products);
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Electronics Shop Backend is running');
});

// Start server on port 3006
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Electronics backend running on http://localhost:${PORT}`);
});
