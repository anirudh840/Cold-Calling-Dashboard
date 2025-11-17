# Files to Upload for Deployment

## 📦 For Railway (Backend)

Upload these **3 files** from the `backend/` folder:

```
✅ backend/server.js
✅ backend/package.json
✅ backend/railway.json
```

**DO NOT upload:**
- ❌ `backend/.env` (set variables in Railway dashboard instead)
- ❌ `backend/.gitignore`
- ❌ `backend/node_modules/` (Railway installs automatically)

---

## 🌐 For TiinyHost (Frontend)

After running `npm run build`, upload **ALL contents** of the `dist/` folder:

```
✅ dist/index.html
✅ dist/assets/ (entire folder with all files)
   ├── index-[hash].js
   ├── index-[hash].css
   └── ... (all other asset files)
✅ Any other files in dist/ folder
```

**Important:** 
- Upload the **contents** of `dist/`, not the `dist/` folder itself
- Make sure `index.html` is in the root of your upload
- Include ALL files, especially the `assets/` folder

---

## 📝 Step-by-Step Upload Instructions

### Railway Upload:

**Option 1: Via GitHub (Recommended)**
1. Create a GitHub repo
2. Push `backend/` folder to GitHub
3. In Railway: New Project → Deploy from GitHub
4. Select repo, set root to `backend/`

**Option 2: Via Railway CLI**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option 3: Via Railway Dashboard**
1. New Project → Empty Project
2. Upload files manually (not recommended, use GitHub)

### TiinyHost Upload:

1. Run `npm run build` in project root
2. Go to tiiny.host
3. Click "Upload"
4. Open `dist/` folder
5. Select ALL files (Ctrl+A / Cmd+A)
6. Drag and drop or click to upload
7. Choose site name
8. Done!

---

## ⚙️ Environment Variables

### Railway (Set in Dashboard):
```
PORT=3001
SPREADSHEET_ID=1OuqXln6GViPNHDdhjUxOJwPhfIv_TFhGP1vVQlFU1PE
```

### Frontend (Create .env.production):
```
VITE_API_URL=https://your-railway-app.railway.app
```
(Replace with your actual Railway URL)

