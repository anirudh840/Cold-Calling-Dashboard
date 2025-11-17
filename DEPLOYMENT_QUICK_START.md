# Quick Deployment Guide

## 🚀 Backend to Railway

### Files to Upload:
```
backend/
├── server.js          ✅ REQUIRED
├── package.json       ✅ REQUIRED  
├── railway.json       ✅ REQUIRED
```

### Steps:
1. Go to [railway.app](https://railway.app) → Sign up/Login
2. Click "New Project" → "Empty Project"
3. Click "New" → "GitHub Repo" (or use CLI)
4. Select your repo, set root directory to `backend/`
5. Go to "Variables" tab, add:
   - `PORT=3001`
   - `SPREADSHEET_ID=1OuqXln6GViPNHDdhjUxOJwPhfIv_TFhGP1vVQlFU1PE`
6. Click "Settings" → "Generate Domain"
7. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

---

## 🌐 Frontend to TiinyHost

### Step 1: Build Frontend
```bash
# Create .env.production file
echo "VITE_API_URL=https://your-railway-app.railway.app" > .env.production

# Replace with your actual Railway URL above, then:

# Build
npm run build
```

### Files to Upload:
Upload **ALL contents** of the `dist/` folder:
```
dist/
├── index.html         ✅ Upload
├── assets/            ✅ Upload entire folder
│   ├── *.js
│   ├── *.css
│   └── ...
└── ... (all other files)
```

### Steps:
1. Go to [tiiny.host](https://tiiny.host) → Sign up/Login
2. Click "Upload" or "New Site"
3. **Select ALL files inside the `dist/` folder**
4. Choose a site name
5. Click "Upload"
6. Your site: `https://your-site-name.tiiny.site`

---

## ✅ Checklist

- [ ] Backend deployed to Railway
- [ ] Railway URL copied
- [ ] `.env.production` created with Railway URL
- [ ] Frontend built (`npm run build`)
- [ ] All `dist/` files uploaded to TiinyHost
- [ ] Dashboard tested and working

---

## 🔧 Troubleshooting

**API not working?**
- Check Railway URL is correct in `.env.production`
- Rebuild: `npm run build`
- Check Railway logs in dashboard

**Blank page?**
- Make sure you uploaded ALL files from `dist/`
- Check browser console (F12) for errors

