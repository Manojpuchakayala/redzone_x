# 🚀 RED-ZONE X — Deployment & Hosting Guide

This guide provides step-by-step instructions for deploying **RED-ZONE X** in production across multiple free/cloud platforms.

---

## 🌟 Option 1: 1-Click Frontend Deployment (Vercel / Netlify)

### A. Deploy to Vercel:
1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**!  
   *(SPA routing is pre-configured via `frontend/vercel.json`)*

---

### B. Deploy to Netlify:
1. Go to [Netlify](https://netlify.com) and click **"Add new site" -> "Import an existing project"**.
2. Select your repository:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Click **"Deploy site"**! *(Pre-configured via `frontend/netlify.toml`)*

---

## ⚙️ Option 2: 1-Click Backend Deployment (Render / Railway)

### A. Deploy to Render:
1. Go to [Render](https://render.com) and click **"New +" -> "Web Service"**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   - `PORT`: `5001`
   - `MONGODB_URI`: *(Your MongoDB Atlas connection string)*
5. Click **"Create Web Service"**!

---

## 🐳 Option 3: 1-Command Docker Full-Stack Deployment

To run the entire full stack (Frontend + Backend + MongoDB) anywhere with Docker:
```bash
docker-compose up --build -d
```
- Frontend: `http://localhost:5175`
- Backend: `http://localhost:5001`
- MongoDB: `localhost:27017`
