# Database Schema

## Entity Relationship Diagram

```
Users
├── Roles (Many-to-Many)
├── Permissions (Many-to-Many)
├── Sessions (One-to-Many)
├── OAuthAccounts (One-to-Many)
├── Notifications (One-to-Many)
├── Payments (One-to-Many)
├── Transactions (One-to-Many)
└── Bets (One-to-Many)

BettingEvents
└── Bets (One-to-Many)

Roles
├── Permissions (Many-to-Many)
└── Users (Many-to-Many)

Permissions
├── Roles (Many-to-Many)
└── Users (Many-to-Many)
```

## Tables Overview

### Users Table
- Core user information
- Authentication credentials
- Profile data
- Status tracking
- Two-factor authentication

### Roles Table
- Role definitions
- Role descriptions
- Permission associations

### Permissions Table
- Granular access control
- Action-based permissions
- Resource-based permissions

### Sessions Table
- User session management
- Token storage
- Session expiration

### OAuthAccounts Table
- OAuth provider integrations
- Google, GitHub support
- Provider account mapping

### Notifications Table
- User notifications
- Multiple notification types
- Read/unread status

### Payments Table
- Payment processing
- Stripe integration
- Transaction status

### Transactions Table
- Transaction history
- Deposits/withdrawals
- Wallet balance tracking

### Bets Table
- Betting information
- Odds and amounts
- Bet status

### BettingEvents Table
- Events for betting
- Event status
- Dynamic odds storage

### ActivityLogs Table
- Audit trail
- User actions
- System changes

### Settings Table
- Application settings
- Configuration management
- Dynamic settings

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Bets
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_status ON bets(status);

-- Activity Logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

## Relationships

### User to Roles (Many-to-Many)
- Allows multiple roles per user
- Enables role-based access control
- Flexible permission model

### User to Permissions (Many-to-Many)
- Direct permission assignment
- Bypasses role-based permissions
- Granular control

### User to Sessions
- Multiple concurrent sessions
- Session tracking
- Device management

### User to Transactions
- Complete transaction history
- Wallet balance tracking
- Audit trail

### User to Bets
- Betting history
- Bet tracking
- Statistics

### Bet to BettingEvent
- Event association
- Event status tracking
- Dynamic odds

## Data Types & Constraints

### Decimal Precision
- Amount fields: `DECIMAL(10,2)` - up to 99,999,999.99
- Odds fields: `DECIMAL(10,4)` - up to 999,999.9999

### Timestamps
- `createdAt`: Automatically set on creation
- `updatedAt`: Automatically updated on modification

### Enums
All enums are defined in the Prisma schema:
- UserStatus
- NotificationType
- PaymentStatus
- TransactionType
- BetType
- BetStatus
- EventType
- EventStatus

## Migration Strategy

```bash
# Create migration
npx prisma migrate dev --name [migration_name]

# Apply migrations in production
npx prisma migrate deploy

# Rollback (reset to baseline)
npx prisma migrate resolve --rolled-back [migration_name]
```

## Performance Considerations

1. **Indexing Strategy**
   - Indexed on frequently queried fields
   - Indexed on foreign keys
   - Indexed on timestamp fields

2. **Query Optimization**
   - Use SELECT specific columns
   - Implement pagination
   - Use caching for read-heavy queries

3. **Data Archiving**
   - Archive old activity logs
   - Archive completed transactions
   - Archive closed betting events

4. **Connection Pooling**
   - Configure Prisma connection pool
   - Set appropriate pool size
   - Implement connection timeout

## Backup Strategy

```bash
# Backup
pg_dump betting_platform > backup.sql

# Restore
psql betting_platform < backup.sql
```

---

**Last Updated**: June 30, 2026
