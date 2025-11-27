# 🔧 Maintenance Plan

This document outlines the maintenance procedures for the Real-Time Chat Application.

## 📅 Regular Maintenance Schedule

### Weekly Tasks
- [ ] Review error logs and performance metrics
- [ ] Check health check endpoint status
- [ ] Monitor uptime and response times
- [ ] Review user feedback and issues

### Monthly Tasks
- [ ] Update dependencies (`npm audit`, `npm update`)
- [ ] Review and optimize database queries
- [ ] Check MongoDB Atlas cluster performance
- [ ] Review and rotate API keys if needed
- [ ] Backup verification

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Database cleanup (old messages, inactive users)
- [ ] Update documentation
- [ ] Review and update deployment configurations

## 🔍 Monitoring

### Health Check Endpoint

Monitor the `/health` endpoint regularly:
```
GET https://your-backend-url.com/health
```

**Expected Response:**
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

### Key Metrics to Monitor

1. **Uptime**: Should be > 99.9%
2. **Error Rate**: Should be < 1%
3. **Response Time**: Should be < 500ms for API endpoints
4. **Memory Usage**: Monitor for memory leaks
5. **Database Connection**: Should always be "connected" if using MongoDB

### Uptime Monitoring Setup

#### Using UptimeRobot (Free)

1. Sign up at [UptimeRobot](https://uptimerobot.com)
2. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-backend-url.com/health`
   - **Interval**: 5 minutes
   - **Alert Contacts**: Add your email

3. Set up alerts for:
   - Status not OK
   - Response time > 2 seconds

## 🐛 Error Tracking

### Sentry Setup (Recommended)

1. **Create Sentry Account**
   - Sign up at [Sentry.io](https://sentry.io)
   - Create a new project (Node.js)

2. **Install Sentry SDK**
   ```bash
   cd server
   npm install @sentry/node @sentry/profiling-node
   ```

3. **Configure Sentry in server.js**
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.tracingHandler());
   
   // After all routes
   app.use(Sentry.Handlers.errorHandler());
   ```

4. **Add Environment Variable**
   ```
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```

### Error Logging Best Practices

- Log all errors with context
- Include user information (without sensitive data)
- Track error frequency
- Set up alerts for critical errors

## 💾 Database Backups

### MongoDB Atlas Backups

MongoDB Atlas provides automatic backups:
- **Free Tier**: Daily snapshots (retained for 2 days)
- **Paid Tier**: Continuous backups with point-in-time recovery

### Manual Backup Procedure

1. **Using MongoDB Compass**
   ```bash
   # Export collection
   mongodump --uri="mongodb+srv://..." --db=chat-app --collection=messages
   ```

2. **Using MongoDB Atlas CLI**
   ```bash
   atlas backups snapshots create --clusterName YourCluster
   ```

### Backup Verification

- Test restore procedure monthly
- Verify backup integrity
- Document restore steps

## 🔄 Rollback Procedures

### Backend Rollback

#### Render
1. Go to Render Dashboard
2. Select your service
3. Go to "Events" tab
4. Find the deployment to rollback to
5. Click "Manual Deploy" → Select commit

#### Railway
1. Go to Railway Dashboard
2. Select your service
3. Go to "Deployments"
4. Click on previous successful deployment
5. Click "Redeploy"

#### Heroku
```bash
heroku releases
heroku rollback v123  # Replace v123 with release number
```

### Frontend Rollback

#### Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Find previous deployment
5. Click "..." → "Promote to Production"

#### Netlify
1. Go to Netlify Dashboard
2. Select your site
3. Go to "Deploys"
4. Find previous deployment
5. Click "..." → "Publish deploy"

## 🔐 Security Maintenance

### Regular Security Tasks

1. **Dependency Updates**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

2. **Environment Variables Review**
   - Rotate API keys quarterly
   - Remove unused environment variables
   - Verify no secrets in code

3. **Access Control Review**
   - Review MongoDB Atlas user permissions
   - Review deployment platform access
   - Remove inactive collaborators

4. **SSL/TLS Certificates**
   - Verify certificates are valid
   - Set up renewal reminders
   - Most platforms auto-renew

## 📊 Performance Monitoring

### Server Resources

Monitor these metrics:
- **CPU Usage**: Should be < 80%
- **Memory Usage**: Should be < 80%
- **Disk Usage**: Should be < 80%
- **Network Traffic**: Monitor for unusual spikes

### Database Performance

1. **Query Performance**
   - Review slow queries monthly
   - Add indexes for frequently queried fields
   - Optimize aggregation pipelines

2. **Connection Pooling**
   - Monitor connection pool usage
   - Adjust pool size if needed
   - Current setting: maxPoolSize: 10

### Frontend Performance

1. **Bundle Size**
   - Monitor build output size
   - Use code splitting (already implemented)
   - Lazy load components if needed

2. **Load Time**
   - Target: < 3 seconds first load
   - Use Lighthouse for performance audits
   - Optimize images and assets

## 🗄️ Database Maintenance

### Message Cleanup

For in-memory mode, messages are automatically limited by `MESSAGE_HISTORY_LIMIT`.

For MongoDB:
```javascript
// Cleanup old messages (older than 30 days)
db.messages.deleteMany({
  timestamp: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});
```

### Index Maintenance

Ensure indexes are created:
```javascript
// Messages collection indexes
db.messages.createIndex({ room: 1, timestamp: -1 });
db.messages.createIndex({ id: 1 }, { unique: true });
```

## 📝 Change Log

Keep a change log of all updates:

### Version 1.0.0 (2024-01-01)
- Initial production deployment
- MongoDB Atlas integration
- Health check endpoint
- CI/CD pipeline setup
- Monitoring and logging

## 🆘 Emergency Procedures

### Server Down

1. Check health endpoint
2. Review platform logs
3. Check MongoDB Atlas status
4. Verify environment variables
5. Rollback if recent deployment

### Database Issues

1. Check MongoDB Atlas status page
2. Verify connection string
3. Check IP whitelist
4. Review connection pool settings
5. Fallback to in-memory mode (automatic)

### High Error Rate

1. Check Sentry for error patterns
2. Review recent code changes
3. Check external service status
4. Scale resources if needed
5. Implement rate limiting (already configured)

## 📞 Support Contacts

- **Platform Support**:
  - Render: support@render.com
  - Railway: support@railway.app
  - Vercel: support@vercel.com
  - Netlify: support@netlify.com

- **MongoDB Atlas**: Support through Atlas dashboard

## 📚 Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Performance Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)

---

**Last Updated**: 2024
**Maintained By**: [Your Name/Team]

