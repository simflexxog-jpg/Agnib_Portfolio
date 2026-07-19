const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the same directory as server.js
const ROOT = __dirname;

app.use(express.static(ROOT, {
  maxAge: '1d',
  etag: true,
  index: 'index.html',
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Catch-all: always serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Portfolio live at http://0.0.0.0:${PORT}`);
});
