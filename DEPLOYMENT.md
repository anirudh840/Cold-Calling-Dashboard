# Deployment Instructions

This guide will help you deploy the Cold Calling Dashboard:
- **Frontend**: TiinyHost (static hosting)
- **Backend**: Railway (Node.js API)

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Backend Files

You need to upload these files to Railway:

```
backend/
├── server.js
├── package.json
├── railway.json
└── .env (create this file, see below)
```

### Step 2: Create Railway Account and Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo" OR "Empty Project"

### Step 3: Deploy Backend

**Option A: Deploy from GitHub (Recommended)**
1. Push your `backend/` folder to a GitHub repository
2. In Railway, click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Set the root directory to `backend/` if needed

**Option B: Deploy via Railway CLI**
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run `railway login`
3. Run `railway init` in the `backend/` folder
4. Run `railway up`

### Step 4: Configure Environment Variables in Railway

1. In Railway dashboard, go to your project
2. Click on your service
3. Go to "Variables" tab
4. Add these environment variables:

```
PORT=3001
SPREADSHEET_ID=1OuqXln6GViPNHDdhjUxOJwPhfIv_TFhGP1vVQlFU1PE
```

### Step 5: Get Your Railway API URL

1. In Railway dashboard, go to your service
2. Click "Settings" → "Generate Domain"
3. Copy the generated URL (e.g., `https://your-app.railway.app`)
4. **Save this URL** - you'll need it for the frontend

---

## Part 2: Deploy Frontend to TiinyHost

### Step 1: Build the Frontend

1. Open terminal in the project root directory
2. Create a `.env.production` file:

```bash
VITE_API_URL=https://your-railway-app.railway.app
```

Replace `https://your-railway-app.railway.app` with your actual Railway URL.

3. Install dependencies (if not already done):
```bash
npm install
```

4. Build the production version:
```bash
npm run build
```

This creates a `dist/` folder with all the static files.

### Step 2: Prepare Files for TiinyHost

You need to upload the **entire contents** of the `dist/` folder to TiinyHost:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (other assets)
└── ... (other files)
```

### Step 3: Deploy to TiinyHost

1. Go to [tiiny.host](https://tiiny.host)
2. Sign up/Login
3. Click "Upload" or "New Site"
4. **Upload the entire `dist/` folder contents**:
   - Select all files inside `dist/` folder
   - Drag and drop or use file picker
5. Choose a site name (e.g., `cold-calling-dashboard`)
6. Click "Upload"
7. Your site will be live at: `https://your-site-name.tiiny.site`

### Step 4: Verify Deployment

1. Visit your TiinyHost URL
2. Open browser console (F12)
3. Check if API calls are working
4. If you see CORS errors, make sure your Railway backend URL is correct in the `.env.production` file

---

## Files Summary

### For Railway (Backend):
```
backend/
├── server.js          ✅ Upload this
├── package.json       ✅ Upload this
├── railway.json       ✅ Upload this
└── .env               ❌ Don't upload (set in Railway dashboard)
```

### For TiinyHost (Frontend):
```
dist/                  ✅ Upload ALL contents of this folder
├── index.html         ✅ Upload
├── assets/            ✅ Upload entire folder
└── ...                ✅ Upload all files
```

---

## Troubleshooting

### Backend Issues:
- **Port not found**: Make sure Railway sets PORT automatically (it should)
- **CORS errors**: Backend already has CORS enabled, should work
- **API not responding**: Check Railway logs in dashboard

### Frontend Issues:
- **API calls failing**: 
  1. Check `.env.production` has correct Railway URL
  2. Rebuild: `npm run build`
  3. Check browser console for errors
- **Blank page**: 
  1. Make sure you uploaded all files from `dist/`
  2. Check if `index.html` is in root of upload
- **404 errors**: Make sure asset paths are correct

### Environment Variables:
- **Development**: Uses `http://localhost:3001` (default)
- **Production**: Uses `VITE_API_URL` from `.env.production`

---

## Quick Deployment Checklist

### Backend (Railway):
- [ ] Created Railway account
- [ ] Created new project
- [ ] Uploaded backend files
- [ ] Set environment variables (PORT, SPREADSHEET_ID)
- [ ] Got Railway URL
- [ ] Tested API endpoint: `https://your-app.railway.app/api/sheet-data`

### Frontend (TiinyHost):
- [ ] Created `.env.production` with Railway URL
- [ ] Ran `npm run build`
- [ ] Created TiinyHost account
- [ ] Uploaded all files from `dist/` folder
- [ ] Verified site is live
- [ ] Tested dashboard functionality

---

## Updating Deployments

### Update Backend:
1. Make changes to `backend/server.js`
2. Push to GitHub (if using GitHub deployment)
3. Railway will auto-deploy
4. Or run `railway up` if using CLI

### Update Frontend:
1. Make changes to frontend code
2. Update `.env.production` if API URL changed
3. Run `npm run build`
4. Upload new `dist/` contents to TiinyHost (replace old files)

---

## Security Notes

- ✅ Backend handles all API calls (no CORS issues)
- ✅ Google Sheets credentials not exposed in frontend
- ✅ Environment variables stored securely in Railway
- ⚠️ Make sure Google Sheet is publicly readable (for CSV export)

---

## Support

If you encounter issues:
1. Check Railway logs: Dashboard → Your Service → Deployments → View Logs
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Test API endpoint directly: `curl https://your-app.railway.app/api/sheet-data`

