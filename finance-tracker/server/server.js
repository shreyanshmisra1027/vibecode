const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get all transactions
app.get('/api/transactions', (req, res) => {
  const { startDate, endDate, category, type } = req.query;

  let query = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' ORDER BY date DESC, id DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single transaction
app.get('/api/transactions/:id', (req, res) => {
  db.get('SELECT * FROM transactions WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json(row);
  });
});

// Create transaction
app.post('/api/transactions', (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount || !category || !date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (type !== 'income' && type !== 'expense') {
    res.status(400).json({ error: 'Type must be income or expense' });
    return;
  }

  const query = `
    INSERT INTO transactions (type, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [type, amount, category, description || '', date], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount || !category || !date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const query = `
    UPDATE transactions
    SET type = ?, amount = ?, category = ?, description = ?, date = ?
    WHERE id = ?
  `;

  db.run(query, [type, amount, category, description, date, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ message: 'Transaction updated' });
  });
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
  db.run('DELETE FROM transactions WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ message: 'Transaction deleted' });
  });
});

// Get summary statistics
app.get('/api/summary', (req, res) => {
  const { startDate, endDate } = req.query;

  let query = `
    SELECT
      type,
      SUM(amount) as total
    FROM transactions
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' GROUP BY type';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    };

    rows.forEach(row => {
      if (row.type === 'income') {
        summary.totalIncome = row.total;
      } else if (row.type === 'expense') {
        summary.totalExpenses = row.total;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpenses;
    res.json(summary);
  });
});

// Get category-wise breakdown
app.get('/api/analytics/by-category', (req, res) => {
  const { startDate, endDate, type } = req.query;

  let query = `
    SELECT
      category,
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions
    WHERE 1=1
  `;
  const params = [];

  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' GROUP BY category ORDER BY total DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get monthly trends
app.get('/api/analytics/monthly-trends', (req, res) => {
  const query = `
    SELECT
      strftime('%Y-%m', date) as month,
      type,
      SUM(amount) as total
    FROM transactions
    GROUP BY month, type
    ORDER BY month DESC
    LIMIT 12
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM transactions ORDER BY category', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.category));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
