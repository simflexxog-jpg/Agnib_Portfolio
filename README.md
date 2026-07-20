# Agnib Sikder - Portfolio

## Deploy to Render (step by step)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Create Web Service on Render

1. Go to **[render.com](https://render.com)** → Sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Fill in these settings **exactly**:

| Setting        | Value            |
|----------------|------------------|
| Environment    | **Node**         |
| Build Command  | `npm install`    |
| Start Command  | `node server.js` |

5. Click **Create Web Service**
6. Wait ~2 min → your site is live at `https://xxxx.onrender.com`

---

## Local test before deploying

```bash
npm install
node server.js
# Visit http://localhost:3000
```

---

## File structure

```
/
├── index.html     ← portfolio page
├── style.css      ← all styles
├── script.js      ← animations & interactions
├── server.js      ← Express server (serves root dir)
├── package.json
├── render.yaml    ← Render auto-config blueprint
└── .gitignore
```
