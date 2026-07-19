const express = require('express');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
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

// ─── GROQ CHAT PROXY (must be before static/catch-all) ───
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured on the server.' });
  }

  const systemPrompt = `You are Agnib's AI assistant embedded in his personal portfolio website.
Your job is to help visitors learn about Agnib Sikder — a Full-Stack Developer and MCA student at RCCIIT, Kolkata.

Key facts about Agnib:
- Skills: JavaScript, Python, React, Node.js, Express, MongoDB, SQL, Docker, Git, REST APIs, LLM integrations
- He has built AI-powered chat systems, logistics platforms, and various web apps
- Contact: agnibsikder016@gmail.com | GitHub: github.com/simflexxog-jpg
- Currently pursuing MCA (Master of Computer Applications)
- Available for full-stack, AI/ML, and web development opportunities

Be concise, friendly, and helpful. If someone asks about hiring or collaboration, encourage them to reach out via email or use the contact section. Keep responses short (2–4 sentences max) unless a detailed question warrants more.`;

  const payload = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 512,
    temperature: 0.7,
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const groqReq = https.request(options, (groqRes) => {
    let data = '';
    groqRes.on('data', chunk => data += chunk);
    groqRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) return res.status(500).json({ error: parsed.error.message });
        const reply = parsed.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        res.json({ reply });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Groq response.' });
      }
    });
  });

  groqReq.on('error', (e) => {
    res.status(500).json({ error: e.message });
  });

  groqReq.write(payload);
  groqReq.end();
});

// Static files — no maxAge so no aggressive browser caching
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