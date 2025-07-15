const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect',
};

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  } else {
    const lastName = parts.pop();
    const firstName = parts.join(' ');
    return { firstName, lastName };
  }
}

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const { firstName, lastName } = splitName(name);

  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO profiles
      (first_name, last_name, email_address, phone_number, password, address_line_1, address_line_2, city, state, postal_code, country, bio)
      VALUES (?, ?, ?, '', ?, '', '', '', '', '', '', '')
    `;

    await connection.execute(query, [firstName, lastName, email, password]);

    await connection.end();

    res.json({ message: 'User signed up successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
