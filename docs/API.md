# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints (except login/register) require Bearer token:
```
Authorization: Bearer <token>
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Body: {
  email: string
  password: string
  username: string
  firstName?: string
  lastName?: string
}
```

#### Login
```
POST /auth/login
Body: {
  email: string
  password: string
}
Response: {
  token: string
  refreshToken: string
  user: User
}
```

#### Refresh Token
```
POST /auth/refresh
Body: {
  refreshToken: string
}
Response: {
  token: string
}
```

### Users

#### Get Profile
```
GET /users/profile
Response: User
```

#### Update Profile
```
PUT /users/profile
Body: {
  firstName?: string
  lastName?: string
  bio?: string
  avatar?: string
}
```

#### Get Settings
```
GET /users/settings
Response: Settings
```

### Bets

#### List Bets
```
GET /bets?page=1&limit=10&status=PENDING
Response: PaginatedResponse<Bet[]>
```

#### Create Bet
```
POST /bets
Body: {
  eventId: string
  type: BetType
  amount: number
  odds: number
}
Response: Bet
```

#### Get Bet
```
GET /bets/:id
Response: Bet
```

### Events

#### List Events
```
GET /events?page=1&limit=10
Response: PaginatedResponse<BettingEvent[]>
```

#### Get Event
```
GET /events/:id
Response: BettingEvent
```

### Payments

#### Create Payment
```
POST /payments
Body: {
  amount: number
  method: PaymentMethod
}
Response: Payment
```

#### List Transactions
```
GET /transactions?page=1&limit=10
Response: PaginatedResponse<Transaction[]>
```

### Admin (requires ADMIN role)

#### List Users
```
GET /admin/users?page=1&limit=10
Response: PaginatedResponse<User[]>
```

#### Get Analytics
```
GET /admin/analytics
Response: Analytics
```

#### Get Activity Logs
```
GET /admin/logs?page=1&limit=10
Response: PaginatedResponse<ActivityLog[]>
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination
- Default limit: 10
- Max limit: 100
- Page: 1-based indexing

---

**Last Updated**: June 30, 2026
