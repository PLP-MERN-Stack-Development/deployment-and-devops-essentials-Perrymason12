# 🚀 Deployment Guide - Week 7 Assignment

This guide covers deploying the Real-Time Chat Application to production environments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [CI/CD Setup](#cicd-setup)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Environment Variables](#environment-variables)

## Prerequisites

### Required Accounts
- [GitHub](https://github.com) - For source code and CI/CD
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For database hosting (optional)
- Backend hosting: [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com)
- Frontend hosting: [Vercel](https://vercel.com), [Netlify](https://netlify.com), or [GitHub Pages](https://pages.github.com)

### MongoDB Atlas Setup (Optional but Recommended)

1. Create a free MongoDB Atlas account
2. Create a new cluster (free tier: M0)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs - less secure)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority`

## Backend Deployment

### Option 1: Render

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   - **Name**: `chat-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to repository root)

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
   DEFAULT_ROOM=general
   CHAT_ROOMS=general,tech,gaming,support
   MESSAGE_HISTORY_LIMIT=300
   ```

4. **Deploy**
   - Render will automatically deploy on every push to the main branch
   - Your backend URL will be: `https://chat-app-backend.onrender.com`

### Option 2: Railway

1. **Create a new project**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Settings**
   - Railway will auto-detect the Node.js app
   - Set the root directory to `server/` in the settings
   - Or use the provided `railway.json` configuration

3. **Set Environment Variables**
   - Same as Render (see above)
   - Add them in the Railway project settings

4. **Deploy**
   - Railway auto-deploys on every push to the main branch

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create chat-app-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
   heroku config:set MONGODB_URI=mongodb+srv://...
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   ```
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Your frontend URL will be: `https://your-project.vercel.app`

### Option 2: Netlify

1. **Import Project**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `client/dist`

3. **Set Environment Variables**
   - Same as Vercel (see above)
   - Add them in Site settings → Environment variables

4. **Deploy**
   - Netlify auto-deploys on every push to the main branch

### Option 3: GitHub Pages

1. **Update `vite.config.js`**
   ```js
   export default defineConfig({
     base: '/your-repo-name/', // Your GitHub repository name
     // ... rest of config
   });
   ```

2. **Create GitHub Actions Workflow**
   - See `.github/workflows/deploy-frontend.yml`
   - Add GitHub Pages deployment step

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select source: GitHub Actions

## CI/CD Setup

### GitHub Actions

The repository includes pre-configured CI/CD workflows:

1. **`.github/workflows/ci.yml`** - Runs on every push/PR
   - Lints and tests backend
   - Builds frontend
   - Checks code quality

2. **`.github/workflows/deploy-backend.yml`** - Backend deployment
3. **`.github/workflows/deploy-frontend.yml`** - Frontend deployment

### Setting Up Secrets

For automated deployments, add these secrets in GitHub:
- Go to repository Settings → Secrets and variables → Actions
- Add:
  - `VITE_SOCKET_URL` - Your backend URL
  - `VITE_API_URL` - Your backend API URL

## Monitoring & Maintenance

### Health Check Endpoint

The backend includes a health check endpoint:

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "environment": "production",
  "metrics": {
    "requests": 1000,
    "errors": 5,
    "errorRate": "0.50%",
    "memory": {
      "heapUsed": "45MB",
      "heapTotal": "60MB",
      "rss": "120MB"
    }
  }
}
```

### Uptime Monitoring

Set up uptime monitoring with services like:
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

Monitor the `/health` endpoint every 5 minutes.

### Error Tracking

For production error tracking, consider:
- [Sentry](https://sentry.io) - Free tier available
- [Rollbar](https://rollbar.com)
- [LogRocket](https://logrocket.com)

### Logging

The application uses Morgan for HTTP request logging:
- Development: Colored console output
- Production: Apache combined log format

### Performance Monitoring

Monitor server resources:
- **Render**: Built-in metrics dashboard
- **Railway**: Built-in metrics
- **Heroku**: Use Heroku Metrics or add-ons

### Maintenance Plan

#### Regular Updates
- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies (`npm audit`, `npm update`)
- **Quarterly**: Review and optimize database queries

#### Database Backups
- **MongoDB Atlas**: Automatic backups (free tier: daily snapshots)
- **Manual backups**: Use `mongodump` for custom backups

#### Rollback Procedures

**Backend Rollback:**
1. Render/Railway: Use the dashboard to rollback to a previous deployment
2. Heroku: `heroku rollback v123`

**Frontend Rollback:**
1. Vercel: Use the deployment history to promote a previous deployment
2. Netlify: Use the deploy log to restore a previous build

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Client URL (for CORS)
CLIENT_URL=https://your-frontend.vercel.app

# MongoDB Configuration (optional)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# Chat Configuration
DEFAULT_ROOM=general
CHAT_ROOMS=general,tech,gaming,support
MESSAGE_HISTORY_LIMIT=300
```

### Frontend (.env)

```env
# Frontend Environment Variables
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_API_URL=https://your-backend.onrender.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` in backend matches your frontend URL exactly
   - Check for trailing slashes

2. **Socket.io Connection Failed**
   - Verify `VITE_SOCKET_URL` points to your backend
   - Check that backend is running and accessible

3. **Build Failures**
   - Check Node.js version (requires >= 18.0.0)
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist includes your server IP
   - Check connection string format
   - App will fall back to in-memory mode if MongoDB fails

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured correctly
- [ ] CORS settings verified
- [ ] Health check endpoint responding
- [ ] CI/CD pipeline running successfully
- [ ] Uptime monitoring configured
- [ ] Error tracking set up (optional)
- [ ] Documentation updated with live URLs

## Support

For issues or questions:
1. Check the application logs
2. Review the health check endpoint
3. Verify environment variables
4. Check platform-specific documentation

---

**Last Updated**: 2024
**Version**: 1.0.0

