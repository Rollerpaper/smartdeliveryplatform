// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db');
const routes = require('./routes');

async function start() {
  // Initialize database and create tables if needed
  await db.init();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve frontend static files from ../frontend
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Redirect root URL to login page
  app.get('/', (req, res) => {
    res.redirect('/login.html');
  });

  // Mount all API routes under /api
  app.use('/api', routes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});