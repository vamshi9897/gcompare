# Deployment Guide for GCompare

This guide covers deploying GCompare to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ PostgreSQL database (production)
2. ✅ Redis instance (production)
3. ✅ API keys for all platform integrations
4. ✅ SMTP credentials for email notifications
5. ✅ Domain name (optional)

## Environment Variables

Set these in your production environment:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Redis
REDIS_URL="redis://host:6379"

# JWT
JWT_SECRET="your-super-secret-production-key"

# Platform API Keys
AMAZON_API_KEY="..."
AMAZON_ASSOCIATE_ID="..."
FLIPKART_API_KEY="..."
# ... add all other platform keys

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.xxx"
FROM_EMAIL="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all environment variables from `.env.example`

4. **Set up External Services**
   - Database: Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
   - Redis: Use [Upstash](https://upstash.com) or [Redis Cloud](https://redis.com/cloud)

5. **Deploy**
   - Vercel automatically deploys on every push to main
   - Run migrations: `npx prisma migrate deploy`

### Build Command

Vercel will use: `npm run build`

### Post-Deploy

After first deployment, run database migrations:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## Option 2: Deploy to Railway

Railway provides hosting for both your app and databases.

### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add Services**
   - Add PostgreSQL plugin
   - Add Redis plugin
   - Railway automatically configures DATABASE_URL and REDIS_URL

4. **Set Environment Variables**
   - Add all other environment variables

5. **Deploy**
   - Railway auto-deploys on push
   - Monitor logs in the dashboard

## Option 3: Docker Deployment

For self-hosting on VPS or cloud providers.

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Update next.config.ts

```typescript
const nextConfig = {
  output: 'standalone',
  // ... other config
};
```

### 3. Build and Run

```bash
# Build image
docker build -t gcompare .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### 4. docker-compose.prod.yml

```yaml
version: '3.8'
services:
  app:
    image: gcompare
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/gcompare
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

## Option 4: DigitalOcean App Platform

### Steps:

1. **Create App**
   - Go to DigitalOcean dashboard
   - Click "Create App"
   - Connect GitHub repository

2. **Configure**
   - Detected: Next.js
   - Build command: `npm run build`
   - Run command: `npm start`

3. **Add Database**
   - Add Managed PostgreSQL
   - Add Managed Redis
   - Automatically sets DATABASE_URL and REDIS_URL

4. **Deploy**
   - Click "Launch"

## Post-Deployment Checklist

After deploying to any platform:

- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Seed initial data: `npx prisma db seed`
- [ ] Verify environment variables
- [ ] Test search functionality
- [ ] Test platform integrations
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificate
- [ ] Configure custom domain
- [ ] Set up backup strategy for database
- [ ] Configure rate limiting
- [ ] Test email notifications
- [ ] Monitor API rate limits

## Database Migrations

### Development
```bash
npx prisma migrate dev --name init
```

### Production
```bash
npx prisma migrate deploy
```

### Rollback
```bash
npx prisma migrate resolve --rolled-back migration_name
```

## Monitoring

### Recommended Tools:

1. **Error Tracking**: [Sentry](https://sentry.io)
2. **Performance**: Vercel Analytics or [New Relic](https://newrelic.com)
3. **Uptime**: [UptimeRobot](https://uptimerobot.com)
4. **Logs**: [Better Stack](https://betterstack.com) or [Papertrail](https://papertrailapp.com)

### Health Check Endpoint

Create `src/app/api/health/route.ts`:
```typescript
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    return Response.json({ status: 'ok' });
  } catch (error) {
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
```

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Set up read replicas for heavy read operations
- Index frequently queried columns

### Caching
- Increase Redis memory
- Implement cache warming for popular searches
- Use CDN for static assets

### API Rate Limiting
- Implement per-IP rate limiting
- Add API key authentication for heavy users
- Use queue for background jobs

## Security

- [ ] Enable HTTPS
- [ ] Set security headers
- [ ] Configure CORS properly
- [ ] Sanitize user inputs
- [ ] Use prepared statements (Prisma handles this)
- [ ] Keep dependencies updated
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for registration
- [ ] Monitor for security vulnerabilities

## Backup Strategy

### Database
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Redis
```bash
# Configure RDB snapshots
redis-cli BGSAVE
```

## Troubleshooting

### Build Failures
- Check environment variables are set
- Verify DATABASE_URL is accessible
- Ensure Prisma schema is valid

### Runtime Errors
- Check logs: `vercel logs` or platform-specific
- Verify database connection
- Check Redis connection
- Validate API keys

### Performance Issues
- Enable caching
- Optimize database queries
- Use Next.js Image optimization
- Implement lazy loading

---

For support, contact support@gcompare.com
