const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database
initializeDatabase();

// Routes
const classRoutes = require('./routes/classRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'ClassManager API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});