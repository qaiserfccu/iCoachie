const express = require('express');
const { Pool } = require('./node_modules/@types/pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Change in production

// Database configuration
const pool = new Pool({
  user: 'qaisu',
  host: 'localhost',
  database: 'iCoachie',
  password: '', // Add password if needed
  port: 5432,
});

// Middleware
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const userId = userResult.rows[0].id;

    // Create profile
    await pool.query(
      'INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3)',
      [userId, firstName, lastName]
    );

    // Assign role
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleResult.rows.length > 0) {
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleResult.rows[0].id]);
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT u.id, u.password_hash, r.name as role FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE u.email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Placeholder: In a real app, send email with reset link
  // For now, just check if user exists
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Email not found' });
    }
    res.json({ message: 'Password reset email sent' }); // Placeholder
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT p.*, r.name as role FROM profiles p JOIN user_roles ur ON p.user_id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE p.user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example route for skills
app.get('/api/assessment-skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_assment_skill"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessment-titles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_assment_title"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_category"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-charts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_chart"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_groups"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-injuries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_injury"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-links', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_link"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/program-units', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "wp_level_program_unit"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add more routes as needed

app.listen(port, () => {
  console.log(`iCoachie Backend listening on port ${port}`);
});