# Isolation Modes - Developer Guide

## Overview

The iCoachie platform implements a comprehensive isolation architecture to ensure data security and proper access control across different user roles and organizational structures.

## Isolation Levels

### 1. GLOBAL
**Roles:** SUPER_ADMIN, SYSTEM_SUPPORT

**Characteristics:**
- Full access to all data across all clubs and facilities
- No filtering required
- Used for platform administration

**Use Case:**
```typescript
// Super admins can see everything
if (isolation.level === IsolationLevel.GLOBAL) {
  // No additional where clauses needed
  return await prisma.club.findMany({ where: { deletedAt: null } });
}
```

### 2. CLUB
**Roles:** CLUB_ADMIN, CLUB_MANAGER, HEAD_COACH, COACH, ACCOUNTANT, FRONT_DESK, CONTENT_MANAGER, MEDICAL_STAFF

**Characteristics:**
- Access limited to data within their club
- `clubId` filtering applied
- Most common isolation level

**Use Case:**
```typescript
// Club-scoped users only see their club's data
if (isolation.level === IsolationLevel.CLUB && isolation.clubId) {
  where.clubId = isolation.clubId;
}
```

### 3. FACILITY
**Roles:** FACILITY_MANAGER, BOOKINGS_COORDINATOR, MAINTENANCE_TECH, EQUIPMENT_MANAGER, SECURITY_STAFF, CLEANING_STAFF

**Characteristics:**
- Access limited to specific facility
- `facilityId` filtering applied
- Can span multiple clubs if facility is shared

**Use Case:**
```typescript
// Facility staff see only their facility
if (isolation.level === IsolationLevel.FACILITY && isolation.facilityId) {
  where.facilityId = isolation.facilityId;
}
```

### 4. VENUE
**Roles:** VENUE_MANAGER

**Characteristics:**
- Access to specific venue within a facility
- `venueId` filtering applied
- Sub-facility level access

### 5. GROUND
**Roles:** GROUND_MANAGER, GROUNDSKEEPER

**Characteristics:**
- Access to specific ground/field
- `groundId` filtering applied
- Specialized for ground maintenance

### 6. FREELANCE
**Roles:** FREELANCER

**Characteristics:**
- Access to their own bookings and clients
- `coachId` filtering applied
- Independent of club structure

**Use Case:**
```typescript
// Freelancers see only their bookings
if (isolation.level === IsolationLevel.FREELANCE && isolation.coachId) {
  where.OR = [
    { coachId: isolation.coachId },
    { freelancerId: isolation.coachId }
  ];
}
```

### 7. PERSONAL
**Roles:** PARENT, STUDENT

**Characteristics:**
- Access to personal data only
- `userId` filtering applied
- Most restricted level

**Use Case:**
```typescript
// Parents see only their own data and their children
if (isolation.level === IsolationLevel.PERSONAL && isolation.userId) {
  where.OR = [
    { userId: isolation.userId },
    { parentId: isolation.userId }
  ];
}
```

## Implementation Steps

### 1. In Middleware

The isolation context is automatically populated by the `populateContext` middleware:

```typescript
import { populateContext } from './middleware/context';

// Apply to routes that need isolation
app.use('/api/resource', populateContext, resourceRoutes);
```

### 2. In Controllers

Access the isolation context from the request:

```typescript
import { AuthRequest } from '../middleware/jwtAuth';
import { IsolationLevel } from '../types/isolation';

router.get('/', requireAuth, populateContext, async (req: AuthRequest, res) => {
  const isolation = req.isolation;
  
  if (!isolation) {
    return res.status(400).json({ message: 'Isolation context required' });
  }

  const where: any = { deletedAt: null };

  // Apply isolation based on level
  switch (isolation.level) {
    case IsolationLevel.GLOBAL:
      // No filtering needed
      break;
    
    case IsolationLevel.CLUB:
      if (isolation.clubId) {
        where.clubId = isolation.clubId;
      }
      break;
    
    case IsolationLevel.FACILITY:
      if (isolation.facilityId) {
        where.facilityId = isolation.facilityId;
      }
      break;
    
    case IsolationLevel.FREELANCE:
      if (isolation.coachId) {
        where.coachId = isolation.coachId;
      }
      break;
    
    case IsolationLevel.PERSONAL:
      if (isolation.userId) {
        where.userId = isolation.userId;
      }
      break;
  }

  const results = await prisma.resource.findMany({ where });
  res.json({ data: results });
});
```

### 3. Helper Functions

Create reusable isolation helpers:

```typescript
// utils/isolation.ts
export function applyIsolationFilter(
  where: any,
  isolation: IsolationContext,
  options?: { 
    clubField?: string;
    facilityField?: string;
    userField?: string;
  }
) {
  const {
    clubField = 'clubId',
    facilityField = 'facilityId',
    userField = 'userId'
  } = options || {};

  switch (isolation.level) {
    case IsolationLevel.GLOBAL:
      // No filtering
      break;
    
    case IsolationLevel.CLUB:
      if (isolation.clubId) {
        where[clubField] = isolation.clubId;
      }
      break;
    
    case IsolationLevel.FACILITY:
      if (isolation.facilityId) {
        where[facilityField] = isolation.facilityId;
      }
      break;
    
    case IsolationLevel.PERSONAL:
      if (isolation.userId) {
        where[userField] = isolation.userId;
      }
      break;
  }
  
  return where;
}

// Usage
const where = applyIsolationFilter({ deletedAt: null }, req.isolation);
```

## Best Practices

### 1. Always Check Isolation Context

```typescript
// ✅ Good
const isolation = req.isolation;
if (!isolation) {
  return res.status(400).json({ message: 'Isolation context required' });
}

// ❌ Bad - assuming isolation exists
const clubId = req.isolation.clubId; // May crash if isolation is undefined
```

### 2. Default to Most Restrictive

```typescript
// ✅ Good - default to personal level
const level = ROLE_ISOLATION_MAPPING[roleCode] || IsolationLevel.PERSONAL;

// ❌ Bad - defaulting to global could be a security issue
const level = ROLE_ISOLATION_MAPPING[roleCode] || IsolationLevel.GLOBAL;
```

### 3. Test Each Isolation Level

```typescript
describe('Resource API with Isolation', () => {
  it('Global admin sees all resources', async () => {
    const token = generateToken(superAdminUser.id);
    const res = await request(app)
      .get('/api/resources')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.length).toBe(totalResources);
  });

  it('Club admin sees only club resources', async () => {
    const token = generateToken(clubAdminUser.id);
    const res = await request(app)
      .get('/api/resources')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.every(r => r.clubId === clubId)).toBe(true);
  });

  it('Parent sees only personal resources', async () => {
    const token = generateToken(parentUser.id);
    const res = await request(app)
      .get('/api/resources')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.every(r => r.userId === parentUser.id)).toBe(true);
  });
});
```

### 4. Document Isolation Requirements

```typescript
/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get sessions (club-isolated)
 *     description: |
 *       Returns sessions based on user's isolation level:
 *       - GLOBAL: All sessions
 *       - CLUB: Sessions in user's club
 *       - PERSONAL: User's own sessions only
 */
router.get('/', requireAuth, populateContext, async (req, res) => {
  // ...
});
```

## Common Patterns

### Pattern 1: Hierarchical Access

```typescript
// Facility managers need club context too
if (isolation.level === IsolationLevel.FACILITY) {
  // Get facility's club
  const facility = await prisma.facility.findUnique({
    where: { id: isolation.facilityId },
    select: { clubId: true }
  });
  
  if (facility?.clubId) {
    where.clubId = facility.clubId;
  }
}
```

### Pattern 2: Multi-Level Queries

```typescript
// Parents accessing their children's data
if (isolation.level === IsolationLevel.PERSONAL) {
  const students = await prisma.student.findMany({
    where: { parentId: isolation.userId }
  });
  
  const studentIds = students.map(s => s.id);
  where.studentId = { in: studentIds };
}
```

### Pattern 3: Shared Resources

```typescript
// Facilities can be shared between clubs
if (isolation.level === IsolationLevel.CLUB) {
  // Get facilities associated with the club
  const clubFacilities = await prisma.clubFacility.findMany({
    where: { clubId: isolation.clubId },
    select: { facilityId: true }
  });
  
  const facilityIds = clubFacilities.map(cf => cf.facilityId);
  where.facilityId = { in: facilityIds };
}
```

## Troubleshooting

### Issue: User sees data from wrong club

**Cause:** Isolation not applied or wrong field used

**Solution:**
```typescript
// Check that the user's clubId is set correctly
console.log('User clubId:', req.user.clubId);
console.log('Isolation:', req.isolation);

// Verify the where clause
console.log('Query where:', JSON.stringify(where, null, 2));
```

### Issue: Isolation context is undefined

**Cause:** `populateContext` middleware not applied

**Solution:**
```typescript
// Add middleware to route
router.get('/', 
  requireAuth,          // Authentication first
  populateContext,      // Then populate isolation
  async (req, res) => {
    // Now req.isolation is available
  }
);
```

### Issue: Global admin can't see all data

**Cause:** Overly restrictive filtering

**Solution:**
```typescript
// Always check for GLOBAL level first
if (isolation.level === IsolationLevel.GLOBAL) {
  // Skip all filters for global admin
} else if (isolation.level === IsolationLevel.CLUB) {
  where.clubId = isolation.clubId;
}
// etc...
```

## TypeScript Types

```typescript
import { IsolationLevel, IsolationContext } from '../types/isolation';

// Extend AuthRequest to include isolation
declare module '../middleware/jwtAuth' {
  interface AuthRequest {
    isolation?: IsolationContext;
  }
}

// Use in your code
function myController(req: AuthRequest, res: Response) {
  const isolation = req.isolation; // Type-safe
  if (isolation?.level === IsolationLevel.CLUB) {
    // TypeScript knows isolation.clubId exists
    console.log('Club ID:', isolation.clubId);
  }
}
```

## Performance Considerations

1. **Index your isolation fields:**
   ```sql
   CREATE INDEX idx_clubId ON resources(clubId) WHERE deletedAt IS NULL;
   CREATE INDEX idx_facilityId ON resources(facilityId) WHERE deletedAt IS NULL;
   ```

2. **Cache isolation context:**
   - The `populateContext` middleware caches the user's role
   - Avoid re-fetching it on every request

3. **Use database-level RLS (Row Level Security):**
   - Consider PostgreSQL RLS for additional security layer
   - Complements but doesn't replace application-level isolation

## Summary

Isolation modes provide a robust, flexible system for data access control in multi-tenant applications. By following this guide, you can:

- ✅ Implement proper data isolation for each role
- ✅ Ensure users only see data they should access
- ✅ Maintain security across organizational boundaries
- ✅ Scale the system as new roles are added

Always test isolation with different user roles and verify that data leakage is impossible.
