# 🚀 Quick Setup Instructions

This guide provides step-by-step instructions to deploy the Real-Time Chat Application.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] MongoDB Atlas account (optional but recommended)
- [ ] Backend hosting account (Render/Railway/Heroku)
- [ ] Frontend hosting account (Vercel/Netlify)

## Step 1: MongoDB Atlas Setup (Optional)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user:
   - Username: `chat-app-user`
   - Password: (generate secure password)
5. Network Access:
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://chat-app-user:password@cluster0.xxxxx.mongodb.net/chat-app?retryWrites=true&w=majority`

## Step 2: Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `chat-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend.vercel.app
   MONGODB_URI=mongodb+srv://...
   DEFAULT_ROOM=general
   CHAT_ROOMS=general,tech,gaming,support
   MESSAGE_HISTORY_LIMIT=300
   ```
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://chat-app-backend.onrender.com`

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_SOCKET_URL=https://chat-app-backend.onrender.com
   VITE_API_URL=https://chat-app-backend.onrender.com
   ```
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL: `https://your-project.vercel.app`

## Step 4: Update Backend CORS

1. Go back to Render Dashboard
2. Edit your backend service
3. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-project.vercel.app
   ```
4. Save and redeploy

## Step 5: Test Deployment

1. Visit your frontend URL
2. Enter a username and connect
3. Test sending messages
4. Check backend health: `https://chat-app-backend.onrender.com/health`

## Step 6: Set Up CI/CD (Automatic)

The GitHub Actions workflows are already configured. They will:
- Run tests on every push
- Build the application
- Prepare for deployment

To enable automatic deployment:
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `VITE_SOCKET_URL`: Your backend URL
   - `VITE_API_URL`: Your backend URL

## Step 7: Set Up Monitoring

### Uptime Monitoring (UptimeRobot)

1. Go to [UptimeRobot](https://uptimerobot.com)
2. Sign up for free account
3. Add Monitor:
   - Type: HTTP(s)
   - URL: `https://chat-app-backend.onrender.com/health`
   - Interval: 5 minutes
4. Add alert contacts (your email)

### Error Tracking (Optional - Sentry)

1. Go to [Sentry.io](https://sentry.io)
2. Create free account
3. Create Node.js project
4. Install Sentry SDK (see MAINTENANCE.md)
5. Add `SENTRY_DSN` to backend environment variables

## Step 8: Update README

Update `README.md` with your deployed URLs:
- Frontend URL
- Backend URL
- Screenshots of CI/CD pipeline

## Troubleshooting

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL exactly
- Check for trailing slashes
- Ensure backend is redeployed after changing `CLIENT_URL`

### Socket.io Connection Failed
- Verify `VITE_SOCKET_URL` is correct
- Check backend is running
- Test health endpoint

### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates (automatic on most platforms)
- [ ] Set up error tracking
- [ ] Configure uptime monitoring
- [ ] Review MAINTENANCE.md for ongoing maintenance

---

For detailed information, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [MAINTENANCE.md](./MAINTENANCE.md) - Maintenance procedures

