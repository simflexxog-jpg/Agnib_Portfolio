const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Disable caching for HTML, JS, CSS so updates are always served fresh
  if (/\.(html|js|css)$/.test(req.path) || req.path === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.use(express.static(ROOT, {
  etag: false,
  index: 'index.html',
}));

// Catch-all: serve index.html for any unmatched GET
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Portfolio live at http://0.0.0.0:${PORT}`);
});