# Installation Guide

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 4.0+)
- **PostgreSQL**: 14.0 or higher
- **Redis**: 7.0.0 or higher (optional but recommended)
- **Git**: Latest version

## Step 1: Clone & Setup

```bash
cd "d:\VS code\Betting plateform"
git init
git add .
git commit -m "Initial commit - Stage 1 Setup"
```

## Step 2: Frontend Installation

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Verify Frontend Setup

```bash
npm run type-check
npm run build
```

## Step 3: Backend Installation

```bash
cd ../backend
npm install
```

### Configure Environment Variables

Create `.env`:

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/betting_platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Setup Database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Verify Backend Setup

```bash
npm run type-check
npm run build
```

## Step 4: Running the Application

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 15 is running on http://localhost:3000
```

### Test the Setup

Visit `http://localhost:3000` in your browser

## Development Tools

### VS Code Extensions

Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Prisma
- Thunder Client (API testing)
- GitLens

### Command Reference

#### Frontend

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
```

#### Backend

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
npm run test             # Run unit tests
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:seed          # Seed database
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres

# Create database manually
createdb betting_platform

# Verify connection string
psql postgresql://postgres:postgres@localhost:5432/betting_platform
```

### Port Already in Use

```bash
# Frontend (3000)
lsof -i :3000
kill -9 <PID>

# Backend (3001)
lsof -i :3001
kill -9 <PID>
```

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prisma Issues

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset
```

## Docker Setup (Optional)

```bash
# Build images
docker build -t betting-platform-frontend ./frontend
docker build -t betting-platform-backend ./backend

# Run containers
docker run -p 3000:3000 betting-platform-frontend
docker run -p 3001:3001 betting-platform-backend
```

## Next Steps

After successful installation:

1. Read [API Documentation](./API.md)
2. Review [Architecture Guide](./ARCHITECTURE.md)
3. Check [Database Schema](./DATABASE.md)
4. Start Stage 2: Design System

---

**Last Updated**: June 30, 2026
