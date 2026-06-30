# Betting Platform - Enterprise Web Application

A production-ready, enterprise-grade betting platform built with modern technologies and premium dark UI design.

## 🎯 Overview

This is a complete full-stack application featuring:
- **Premium Dark Theme UI** with glassmorphic design
- **Real-time Updates** using Socket.io
- **Secure Authentication** with JWT and OAuth
- **Payment Integration** with Stripe
- **Professional Dashboard** with analytics
- **Responsive Design** across all devices
- **Enterprise Architecture** with clean code patterns

## 📁 Project Structure

```
betting-platform/
├── frontend/                 # Next.js + React 19 application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express + Node.js API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── db/              # Database utilities
│   ├── prisma/              # Prisma schema
│   └── package.json
│
└── docs/                    # Documentation
```

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payments

### DevOps & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend deployment
- **Railway** - Backend deployment

## 🎨 Design System

### Colors
- **Primary Background**: #050505
- **Secondary**: #101010
- **Cards**: #161616
- **Borders**: #252525
- **Accent**: #00E0FF (Cyan)
- **Secondary Accent**: #8A5CFF (Purple)
- **Success**: #00D26A (Green)
- **Warning**: #FFB800 (Yellow)
- **Danger**: #FF4D4F (Red)

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

Backend runs on `http://localhost:3001`

## 📋 Features

### User Features
- ✅ User Authentication (Register, Login, OAuth)
- ✅ Dashboard with Analytics
- ✅ Betting System
- ✅ Payment Processing
- ✅ Profile Management
- ✅ Notifications
- ✅ Transaction History
- ✅ Settings

### Admin Features
- ✅ User Management
- ✅ Analytics & Reports
- ✅ Activity Logs
- ✅ Content Management
- ✅ Role & Permission Management
- ✅ System Settings

## 🔐 Security

- ✅ Helmet.js for HTTP headers
- ✅ CSRF Protection
- ✅ XSS Prevention
- ✅ SQL Injection Prevention
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Secure Cookies
- ✅ Password Hashing (bcrypt)
- ✅ Audit Logs

## 📊 Development Stages

1. ✅ **Stage 1**: Project Setup
2. ✅ **Stage 2**: Design System
3. ✅ **Stage 3**: Landing Page
4. ✅ **Stage 4**: Authentication
5. ✅ **Stage 5**: Dashboard
6. ✅ **Stage 6**: Backend
7. ✅ **Stage 7**: Database
8. ✅ **Stage 8**: Admin Panel
9. ✅ **Stage 9**: Testing
10. ✅ **Stage 10**: Deployment

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Installation Guide](./docs/INSTALLATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test
npm run test:e2e

# Backend tests
cd backend
npm run test
```

## 📦 Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Railway (Backend)
```bash
cd backend
railway deploy
```

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- Senior Product Designer
- Senior UI/UX Designer
- Senior Frontend Engineer
- Senior Backend Engineer
- DevOps Engineer
- Security Engineer
- QA Engineer

---

**Status**: ✅ Completed - All Stages Complete

Last Updated: June 30, 2026
