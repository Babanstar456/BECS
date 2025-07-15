const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: '82.25.106.64',
  user: 'u617065149_Banerjee',
  password: 'SwattikA1',
  database: 'u617065149_Banerjee_Elect'
};

// Helper: Get next PID for Electronics or Electrical

async function getNextPID(connection, targetTable, prefix) {
  // Check highest in targetTable
  const [targetRows] = await connection.execute(
    `SELECT PID FROM ${targetTable} WHERE PID LIKE ? ORDER BY PID DESC LIMIT 1`,
    [`${prefix}%`]
  );

  // Check highest in All_Items
  const [allRows] = await connection.execute(
    `SELECT PID FROM All_Items WHERE PID LIKE ? ORDER BY PID DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let maxNum = 0;

  if (targetRows.length > 0) {
    const num = parseInt(targetRows[0].PID.slice(1));
    if (!isNaN(num)) maxNum = Math.max(maxNum, num);
  }

  if (allRows.length > 0) {
    const num = parseInt(allRows[0].PID.slice(1));
    if (!isNaN(num)) maxNum = Math.max(maxNum, num);
  }

  const nextNum = maxNum + 1;
  return `${prefix}${nextNum.toString().padStart(3, '0')}`;
}


// Upload route with wiping & dual insert
app.post('/api/upload-items', async (req, res) => {
  const { type, items } = req.body;
  if (!type || !items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: 'Missing type or items array.' });
  }

  // Determine target table and PID prefix
  const targetTable = type === 'electronics' ? 'Electronics_Items'
                    : type === 'electrical' ? 'Electrical_Items'
                    : null;
  const prefix = type === 'electronics' ? '1'
               : type === 'electrical' ? '2'
               : null;

  if (!targetTable || !prefix) {
    return res.status(400).json({ success: false, message: 'Invalid type.' });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    // ✅ Wipe ONLY target table (Electronics_Items or Electrical_Items)
    await conn.execute(`DELETE FROM ${targetTable}`);

    for (const item of items) {
      // Generate PID with prefix
      const pid = await getNextPID(conn, targetTable, prefix);

      // Insert into target table
      await conn.execute(
        `INSERT INTO ${targetTable} (PID, name, category, price, imglink, description, subcat)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pid,
          item.name || '',
          item.category || '',
          item.price || 0,
          item.imglink || '',
          item.description || '',
          item.subcat || ''
        ]
      );

      // ✅ Also insert into All_Items
      await conn.execute(
        `INSERT INTO All_Items (PID, name, category, price, imglink, description, subcat)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pid,
          item.name || '',
          item.category || '',
          item.price || 0,
          item.imglink || '',
          item.description || '',
          item.subcat || ''
        ]
      );
    }

    await conn.end();

    res.json({ success: true, message: `Wiped ${targetTable}, inserted ${items.length} items, also copied to All_Items.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.listen(3004, () => {
  console.log('✅ Server listening on port 3004');
});
