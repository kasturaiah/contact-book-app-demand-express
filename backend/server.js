// 1. Import dependencies
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// 2. Initialize the app and database
const app = express();
const port = process.env.PORT || 5000;
const db = new sqlite3.Database('contacts.db');

// 3. Set up middleware
app.use(cors());
app.use(express.json());

// 4. Create the contacts table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      is_favorite INTEGER DEFAULT 0
    )
  `);
});

// 5. Implement API endpoints

// GET all contacts with pagination
app.get('/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.get('SELECT COUNT(*) AS count FROM contacts', (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const totalCount = result.count;
    const totalPages = Math.ceil(totalCount / limit);

    db.all('SELECT * FROM contacts ORDER BY is_favorite DESC LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ contacts: rows, totalCount, totalPages });
    });
  });
});

// POST a new contact
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body || {}; // Added a null check here
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\d{10}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format. Must be 10 digits.' });
  }

  try {
    db.run('INSERT INTO contacts (name, email, phone, is_favorite) VALUES (?, ?, ?, 0)', [name, email, phone], function(err) {
      if (err) {
        console.error('Database error on INSERT:', err.message);
        return res.status(500).json({ error: 'Database insertion failed.' });
      }
      res.status(201).json({ id: this.lastID, name, email, phone, is_favorite: 0 });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

// PUT to update a contact (including favorite status)
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, is_favorite } = req.body || {}; // Added a null check here

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const favoriteStatus = is_favorite ? 1 : 0;
  const sql = `UPDATE contacts SET name = ?, email = ?, phone = ?, is_favorite = ? WHERE id = ?`;
  const values = [name, email, phone, favoriteStatus, id];

  db.run(sql, values, function(err) {
    if (err) {
      console.error('Database error on UPDATE:', err.message);
      return res.status(500).json({ error: 'Database update failed.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found.' });
    }
    res.json({ message: 'Contact updated successfully.', updatedContact: { id, name, email, phone, is_favorite } });
  });
});

// DELETE a contact
app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM contacts WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  });
});

// 6. Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});