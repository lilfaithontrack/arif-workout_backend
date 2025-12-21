# Deployment Guide

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for production)
- Node.js hosting platform (Heroku, Railway, AWS, DigitalOcean, etc.)
- Payment provider accounts (Stripe, Telebirr, Apple Pay)
- Email service (Gmail, SendGrid, etc.)
- SMS service (Twilio)

## Environment Setup

### Production Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arif-workout?retryWrites=true&w=majority

# JWT
JWT_SECRET=super-secure-random-string-min-32-chars
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Telebirr (Ethiopia)
TELEBIRR_APP_ID=your-app-id
TELEBIRR_APP_KEY=your-app-key
TELEBIRR_PUBLIC_KEY=your-public-key
TELEBIRR_API_URL=https://api.telebirr.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin
ADMIN_EMAIL=admin@arifworkout.com
```

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Add database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific IPs)
5. Get connection string and update `MONGODB_URI`

## Deployment Platforms

### 1. Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create arif-workout-api

# Add MongoDB addon (or use Atlas)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set STRIPE_SECRET_KEY=your-key
# ... set all other variables

# Deploy
git push heroku main

# Open app
heroku open
```

**Procfile** (already configured):
```
web: node src/server.js
```

### 2. Railway

1. Go to https://railway.app
2. Connect GitHub repository
3. Add MongoDB plugin or use Atlas
4. Set environment variables in Railway dashboard
5. Deploy automatically on push

### 3. DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Create new app from GitHub
3. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
4. Add MongoDB database or use Atlas
5. Set environment variables
6. Deploy

### 4. AWS (EC2 + PM2)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-repo/arif-workout.git
cd arif-workout/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Paste your production environment variables

# Start with PM2
pm2 start src/server.js --name arif-workout-api

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 monit
```

### 5. Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/arif-workout
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

Deploy:
```bash
docker-compose up -d
```

## Webhook Configuration

### Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy webhook secret and set `STRIPE_WEBHOOK_SECRET`

### Telebirr Webhooks

Configure in Telebirr merchant dashboard:
- Webhook URL: `https://your-domain.com/api/webhooks/telebirr`

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d api.arifworkout.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/arif-workout
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name api.arifworkout.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.arifworkout.com;

    ssl_certificate /etc/letsencrypt/live/api.arifworkout.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.arifworkout.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Backup

### MongoDB Atlas Automated Backups

Enabled by default in Atlas clusters.

### Manual Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
MONGODB_URI="your-mongodb-uri"

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: backup_$DATE"
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs arif-workout-api

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Application Monitoring Services

- **New Relic**: https://newrelic.com
- **Datadog**: https://www.datadoghq.com
- **Sentry** (Error tracking): https://sentry.io

## Performance Optimization

### 1. Enable Compression

Already included via Express middleware.

### 2. Database Indexing

Indexes are defined in models. Ensure they're created:
```bash
# In MongoDB shell
db.users.getIndexes()
db.courses.getIndexes()
```

### 3. Caching (Redis)

Add Redis for caching frequently accessed data:

```bash
npm install redis
```

```javascript
// config/redis.js
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis error:', err));
client.connect();

module.exports = client;
```

### 4. Rate Limiting

Already configured in `server.js`. Adjust limits in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window
```

## Security Checklist

- [ ] Use strong `JWT_SECRET` (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Validate all user inputs
- [ ] Keep dependencies updated
- [ ] Use MongoDB Atlas IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Set up webhook signature verification
- [ ] Use secure payment provider keys
- [ ] Enable logging and monitoring
- [ ] Regular security audits: `npm audit`

## Scaling

### Horizontal Scaling

Use load balancer (Nginx, AWS ELB) with multiple instances:

```bash
# Start multiple instances with PM2
pm2 start src/server.js -i max
```

### Database Scaling

- Use MongoDB Atlas auto-scaling
- Enable read replicas for read-heavy operations
- Implement database sharding for large datasets

## Troubleshooting

### Check Logs

```bash
# PM2
pm2 logs arif-workout-api

# Heroku
heroku logs --tail

# Docker
docker logs container-name
```

### Database Connection Issues

- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Payment Webhook Issues

- Verify webhook URL is accessible
- Check webhook signature verification
- Review Stripe/Telebirr dashboard for webhook delivery status

## Rollback Strategy

### Git-based Rollback

```bash
# View commits
git log --oneline

# Rollback to previous commit
git reset --hard COMMIT_HASH
git push -f origin main

# Redeploy
```

### PM2 Rollback

```bash
pm2 reload arif-workout-api
```

## Support & Maintenance

- Monitor error logs daily
- Review payment reconciliation weekly
- Update dependencies monthly: `npm update`
- Security audit monthly: `npm audit`
- Database backup verification weekly
- Performance monitoring continuous

---

**Production Checklist Complete!** 🚀

Your API is now ready for production deployment.
