# Deployment Guide

## Frontend Deployment (Vercel)

### Automatic Deployment
1. Push code to GitHub
2. Connect Vercel to GitHub repository
3. Vercel automatically detects Next.js and deploys

### Environment Variables
Set these in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

### Build Settings
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## Backend Deployment (Railway)

### Docker Deployment
1. Connect GitHub to Railway
2. Create new project from GitHub
3. Select backend folder
4. Railway auto-detects Dockerfile

### Environment Variables
Set these in Railway:
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your_production_secret
REDIS_URL=redis://...
```

### Database (PostgreSQL)
1. Add PostgreSQL plugin to Railway project
2. Railway provides connection string automatically
3. Migrations run automatically on deploy

## Docker Compose (Local/Self-hosted)

### Start All Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f [service]
```

## CI/CD Pipeline (GitHub Actions)

### Frontend Pipeline
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Backend Pipeline
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway/action@master
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## Database Backup

### PostgreSQL Backup
```bash
pg_dump betting_platform > backup.sql
```

### Restore
```bash
psql betting_platform < backup.sql
```

## Monitoring & Logging

### Vercel Analytics
- Real-time performance metrics
- Core Web Vitals tracking
- Error tracking

### Railway Monitoring
- Real-time logs
- CPU/Memory usage
- Deployment history

## SSL/HTTPS Setup

### Vercel
- Automatic HTTPS
- Let's Encrypt certificate
- Auto-renewal

### Railway
- Auto HTTPS via Let's Encrypt
- Configure custom domain in settings

## Scaling

### Frontend (Vercel)
- Automatic scaling
- Edge locations worldwide
- CDN integrated

### Backend (Railway)
- Vertical scaling (CPU/Memory)
- Database replication
- Load balancing

---

**Last Updated**: June 30, 2026
