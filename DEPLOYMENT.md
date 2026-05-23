# DEPLOYMENT.md - Deployment & Production Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] Cloudinary account setup with API credentials
- [ ] JWT secret key generated (strong, random string)
- [ ] CORS origin URL configured for production frontend
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security audit completed

## Environment Setup

### Local Development

1. **Install MongoDB locally**
   - Download from https://www.mongodb.com/try/download/community
   - Follow installation instructions for your OS
   - Verify: `mongod --version`

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env with local values**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ur-message
   JWT_SECRET=dev_secret_key_change_in_production
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_test_cloud
   CLOUDINARY_API_KEY=your_test_key
   CLOUDINARY_API_SECRET=your_test_secret
   CLIENT_URL=http://localhost:3000
   ```

### Production Environment

#### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Set up database user with strong password
4. Whitelist IP addresses
5. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ur-message?retryWrites=true&w=majority
   ```

#### Environment Variables

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ur-message
JWT_SECRET=very_long_random_secure_key_here_min_32_chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_production_cloud
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET=your_production_secret
CLIENT_URL=https://yourdomain.com
```

**Generate strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Options

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   choco install heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create ur-message-api
   ```

4. **Set environment variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud
   heroku config:set CLOUDINARY_API_KEY=your_key
   heroku config:set CLOUDINARY_API_SECRET=your_secret
   heroku config:set CLIENT_URL=https://yourfrontend.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View logs**
   ```bash
   heroku logs --tail
   ```

### Option 2: AWS Elastic Beanstalk

1. **Install AWS CLI**
   ```bash
   pip install awscli
   aws configure
   ```

2. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

3. **Initialize EB application**
   ```bash
   eb init -p "Node.js 18 running on 64bit Amazon Linux 2" ur-message-api
   ```

4. **Create environment**
   ```bash
   eb create ur-message-prod
   ```

5. **Set environment variables**
   ```bash
   eb setenv PORT=5000 NODE_ENV=production MONGODB_URI=... JWT_SECRET=...
   ```

6. **Deploy**
   ```bash
   eb deploy
   ```

### Option 3: DigitalOcean App Platform

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to DigitalOcean**
   - Create new app
   - Connect GitHub repository
   - Select branch to deploy

3. **Configure app**
   - Set Node version: 18
   - Set run command: `npm start`

4. **Add environment variables**
   - Add all variables from .env

5. **Deploy**
   - Click deploy
   - Monitor logs

### Option 4: Railway.app

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Set variables**
   ```bash
   railway variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 5: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY src ./src
   
   EXPOSE 5000
   
   CMD ["npm", "start"]
   ```

2. **Create .dockerignore**
   ```
   node_modules
   npm-debug.log
   .env
   .git
   .gitignore
   README.md
   ```

3. **Build image**
   ```bash
   docker build -t ur-message-backend:1.0 .
   ```

4. **Run container**
   ```bash
   docker run -p 5000:5000 \
     -e MONGODB_URI=mongodb+srv://... \
     -e JWT_SECRET=... \
     ur-message-backend:1.0
   ```

## Performance Optimization

### Enable Compression
Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### Implement Rate Limiting
```bash
npm install express-rate-limit
```

Add to server.js:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Database Connection Pooling
MongoDB/Mongoose automatically manages connection pooling.

### Redis Caching (Optional)
```bash
npm install redis
```

## Monitoring & Logging

### Application Monitoring

1. **New Relic**
   ```bash
   npm install newrelic
   ```

2. **DataDog**
   - Cloud monitoring service
   - Real-time metrics

3. **Sentry**
   ```bash
   npm install @sentry/node
   ```

### Logging

```bash
npm install winston
```

Example logging setup:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## SSL/TLS Certificate

### Using Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Generate certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Configure in Node.js**
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ur-message-api
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancer Setup**
   - Use Nginx or AWS ELB
   - Route requests across multiple server instances

2. **Redis Session Management**
   ```bash
   npm install redis
   ```

3. **Socket.IO Redis Adapter**
   ```bash
   npm install socket.io-redis
   ```

### Vertical Scaling
- Increase server CPU/RAM
- Upgrade database tier
- Optimize database indexes

## Maintenance & Updates

### Regular Backups
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ur-message"

# Restore
mongorestore --uri="mongodb+srv://..." /dump
```

### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Security audit
npm audit
npm audit fix
```

### Database Migrations
- Plan schema changes
- Test thoroughly in staging
- Use MongoDB schema versioning
- Keep backward compatibility

## Troubleshooting

### Connection Issues
- Check MongoDB connection string
- Verify IP whitelist on MongoDB Atlas
- Check CORS origin configuration
- Test with: `curl -i http://localhost:5000/health`

### Memory Leaks
- Monitor with: `node --max-old-space-size=4096 src/server.js`
- Check Socket.IO connection tracking
- Review event listeners for cleanup

### Database Performance
- Check indexes: `db.users.getIndexes()`
- Analyze slow queries
- Monitor connection pool size

### High CPU Usage
- Check for infinite loops
- Monitor event handlers
- Profile with: `node --prof src/server.js`

## Rollback Procedure

```bash
# Heroku
heroku releases
heroku rollback v123

# Git revert
git revert <commit-hash>
git push origin main
```

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ random characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Enable database backup
- [ ] Configure monitoring & alerting
- [ ] Use environment variables (no hardcoded secrets)
- [ ] Enable CORS only for known origins
- [ ] Regular security updates
- [ ] Implement API key rotation
- [ ] Set up DDoS protection (Cloudflare, AWS Shield)
- [ ] Regular security audits
- [ ] Implement request validation
- [ ] Use helmet.js for HTTP headers

## Support & Resources

- **Node.js Docs**: https://nodejs.org/en/docs/
- **Express Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Socket.IO Docs**: https://socket.io/docs/
- **Heroku Docs**: https://devcenter.heroku.com/

---

**Deployment Guide** - Last Updated: May 23, 2026
