# Architecture Guide

## System Design

```
┌─────────────────────────────────────────────────────┐
│                  Client Layer                        │
│  ┌──────────────────────────────────────────────┐  │
│  │  Next.js 15 (React 19 + TypeScript)          │  │
│  │  - Server Components                          │  │
│  │  - Client Components                          │  │
│  │  - API Routes                                 │  │
│  │  - Middleware                                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓ (HTTPS)
┌─────────────────────────────────────────────────────┐
│               API Gateway Layer                      │
│  - Rate Limiting                                    │
│  - CORS                                             │
│  - Request Validation                               │
└─────────────────────────────────────────────────────┘
                        ↓ (HTTP/2)
┌─────────────────────────────────────────────────────┐
│              Backend Application Layer               │
│  ┌──────────────────────────────────────────────┐  │
│  │  Express Server (TypeScript)                  │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │ Routes                                  │  │  │
│  │  ├─ Auth Routes                           │  │  │
│  │  ├─ User Routes                           │  │  │
│  │  ├─ Betting Routes                        │  │  │
│  │  ├─ Admin Routes                          │  │  │
│  │  └─ Payment Routes                        │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │ Controllers                             │  │  │
│  │  │ - Request handling                      │  │  │
│  │  │ - Response formatting                  │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │ Services                                │  │  │
│  │  │ - Business Logic                        │  │  │
│  │  │ - Data Processing                       │  │  │
│  │  │ - External APIs                         │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │ Middleware                              │  │  │
│  │  │ - Authentication                        │  │  │
│  │  │ - Authorization                         │  │  │
│  │  │ - Error Handling                        │  │  │
│  │  │ - Logging                               │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            Data Access & Cache Layer                │
│  ┌──────────────────────────────────────────────┐  │
│  │ Prisma ORM (TypeScript)                       │  │
│  │ - Query Builder                               │  │
│  │ - Transactions                                │  │
│  │ - Migrations                                  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Redis Cache                                   │  │
│  │ - Session Storage                             │  │
│  │ - Query Results Caching                       │  │
│  │ - Real-time Data                              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            Data Persistence Layer                   │
│  ┌──────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                           │  │
│  │ - Users & Authentication                      │  │
│  │ - Transactions & Payments                     │  │
│  │ - Bets & Events                               │  │
│  │ - Activity Logs                               │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

### 1. Presentation Layer (Frontend)
- React Components
- Page Components
- UI Components
- State Management (Zustand)
- API Integration (Axios)

### 2. Application Layer (Backend)
- Controllers
- Route Definitions
- Request/Response Handling

### 3. Domain/Business Layer
- Services
- Business Logic
- Domain Models
- Validation

### 4. Data/Persistence Layer
- Prisma ORM
- Database Queries
- Data Repositories

## Design Patterns

### Frontend Patterns
- **Container/Presentational Components**
- **Custom Hooks** for logic reuse
- **Zustand Store** for global state
- **React Query** for server state

### Backend Patterns
- **Controller** - Handle HTTP requests
- **Service** - Encapsulate business logic
- **Repository** - Data access abstraction
- **Middleware** - Cross-cutting concerns
- **Dependency Injection** - Loose coupling

## Security Architecture

```
Request → API Gateway
  ↓
Helmet Headers
  ↓
CORS Middleware
  ↓
Rate Limiter
  ↓
Authentication
  ↓
Authorization
  ↓
Input Validation
  ↓
Business Logic
  ↓
Response
```

## Real-time Architecture (Socket.io)

```
Client → WebSocket Connection → Socket.io Server
  ↓
Event Handler
  ↓
Service Logic
  ↓
Broadcast to Rooms
  ↓
Update Database
```

## Deployment Architecture

```
GitHub → Actions → Build & Test → Deploy
                        ↓
                   Frontend (Vercel)
                        ↓
                   Backend (Railway)
                        ↓
                   Database (PostgreSQL)
```

## Performance Optimization

### Frontend
- Code Splitting
- Lazy Loading
- Image Optimization
- Caching Strategy
- Bundle Analysis

### Backend
- Database Indexing
- Query Optimization
- Caching Layer (Redis)
- Connection Pooling
- Compression

## Scalability Considerations

- Horizontal scaling for backend
- Database replication
- Load balancing
- Microservices-ready architecture
- Event-driven design

---

**Last Updated**: June 30, 2026
