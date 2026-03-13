# Security Documentation

**Study Frontier** - Security Considerations and Best Practices

---

## 🔒 Security Overview

This document outlines the security measures implemented in Study Frontier and guidelines for maintaining security in production.

---

## Authentication & Authorization

### Supabase Auth

- **Provider**: Supabase Auth (built on PostgreSQL + GoTrue)
- **Session Management**: HTTP-only cookies managed by `@supabase/ssr`
- **Password Requirements**: Enforced by Supabase (minimum 6 characters)
- **Email Verification**: Required for all new accounts

### Role-Based Access Control (RBAC)

Four distinct user roles with strict access controls:

1. **Student** - Access to own data only
2. **Parent** - Read-only access to linked student data
3. **Admin** - Full access to all data and operations
4. **Counselor** - Future role for staff workflows

**Implementation:**
- `lib/auth/roles.ts` - Role definitions and permission checks
- `lib/auth/utils.ts` - Auth helper functions
- `components/auth/role-guard.tsx` - Client-side UI guards

### API Authentication Patterns

All API routes follow these patterns:

```typescript
// Pattern 1: Using getCurrentUser (recommended)
const user = await getCurrentUser();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Pattern 2: Direct auth check
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Pattern 3: Role verification
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (!profile || profile.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## Row Level Security (RLS)

### Database-Level Protection

All tables use **Row Level Security** policies to enforce access control at the database level.

**Key RLS Policies:**

1. **Profiles**
   - Users can view their own profile
   - Admins can view all profiles
   - Only users can update their own non-role fields
   - Only admins can change roles

2. **Students**
   - Students can view their own record
   - Parents can view linked student records
   - Admins can view all students

3. **Documents**
   - Students can view their own documents
   - Admins can view all documents
   - Students can update own uploads (limited fields)
   - Admins have full update access

4. **Applications**
   - Students can view their own applications
   - Admins can view and manage all applications

5. **DS-160 Data**
   - Students can view/update their own DS-160
   - Admins can view all DS-160 forms
   - Cannot modify after approval status

6. **Payments**
   - Students can view their own payments
   - Admins can view and manage all payments

7. **Notifications**
   - Users can only view their own notifications
   - Users can mark own notifications as read

**Location**: `lib/supabase/rls-policies.sql`

### RLS Testing Checklist

- [ ] Students cannot access other students' data
- [ ] Parents can only view, not modify
- [ ] Admins have appropriate full access
- [ ] Unauthenticated users have no access
- [ ] Service role bypasses RLS (use with caution)

---

## Input Validation

### Zod Schemas

All user inputs are validated using **Zod** schemas before processing.

**Validation Files:**
- `lib/validations/applications.ts` - Application forms
- `lib/validations/contact.ts` - Contact form
- `lib/validations/documents.ts` - Document requirements
- `lib/validations/ds160.ts` - DS-160 form data

**Pattern:**

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
  // ... more fields
});

// In API route
const validation = schema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: 'Invalid input', details: validation.error.issues },
    { status: 400 }
  );
}
```

### File Upload Security

**File Upload Endpoint**: `app/api/documents/upload/route.ts`

**Security Measures:**
- File size limit: 10MB maximum
- Allowed MIME types: PDF, JPEG, PNG, WEBP, Word documents
- Ownership verification: Students can only upload to their own documents
- Unique file naming: Prevents overwrites
- Storage path isolation: Files organized by student ID

**File Upload Validation:**
```typescript
// Size check
if (file.size > 10 * 1024 * 1024) {
  return NextResponse.json(
    { error: 'File size must be less than 10MB' },
    { status: 400 }
  );
}

// Type check
const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  // ...
];
if (!allowedTypes.includes(file.type)) {
  return NextResponse.json(
    { error: 'Invalid file type' },
    { status: 400 }
  );
}
```

---

## Secrets Management

### Environment Variables

**Never commit these to version control:**
- `.env.local` - Local development secrets
- `.env.production` - Production secrets (if used)

**Template**: `.env.example` - Safe to commit

### Variable Types

**Public (exposed to browser):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

**Private (server-side only):**
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL: Never expose to client**
- `PAYPAL_CLIENT_SECRET`
- Any future API keys

### Service Role Key Safety

The `SUPABASE_SERVICE_ROLE_KEY` **bypasses all RLS policies**. Use only when absolutely necessary.

**Safe Usage:**
- Server components
- API routes
- Server actions
- Background jobs

**NEVER:**
- Expose in client-side code
- Log to console
- Store in client state
- Send in API responses

---

## XSS Protection

### React's Built-in Protection

React automatically escapes values rendered in JSX, preventing most XSS attacks.

**Safe:**
```tsx
<div>{userInput}</div>
```

**Dangerous (not used in codebase):**
```tsx
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### CMS Content

The CMS system stores content as JSON. When rendering, ensure proper escaping:

```typescript
// Safe rendering
<p>{cmsContent.text}</p>

// If HTML is needed, sanitize first (future implementation)
// Use DOMPurify or similar library
```

---

## CSRF Protection

### Next.js Built-in Protection

Next.js provides CSRF protection through:
- SameSite cookies
- Origin checking
- Server-side session management

### API Routes

All state-changing operations use:
- POST, PATCH, DELETE methods (not GET)
- Authentication required
- Supabase session validation

---

## SQL Injection Protection

### Supabase Client

The Supabase client uses **parameterized queries** by default, preventing SQL injection.

**Safe Pattern:**
```typescript
// ✅ Safe - Supabase handles escaping
const { data } = await supabase
  .from('students')
  .select('*')
  .eq('id', studentId);
```

**Dangerous Pattern (not used):**
```typescript
// ❌ Dangerous - Raw SQL with user input
// NEVER DO THIS
const query = `SELECT * FROM students WHERE id = '${studentId}'`;
```

---

## Rate Limiting

### Current Status

⚠️ **Not implemented** - Recommended for production

### Recommendations

**Endpoints to protect:**
- `/api/auth/*` - Login, signup
- `/api/documents/upload` - File uploads
- `/api/payments` - Payment creation
- Contact form submissions

**Implementation Options:**
1. Vercel Edge Config + Upstash Redis
2. Supabase Edge Functions with rate limiting
3. Cloudflare Rate Limiting (if using Cloudflare)

---

## HTTPS & Transport Security

### Production Requirements

- ✅ **HTTPS Only** - Enforced by Vercel deployment
- ✅ **Secure Cookies** - Handled by Supabase SSR
- ✅ **HSTS Headers** - Configured in Vercel

### Headers Configuration

Vercel automatically sets security headers. For additional hardening, add `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Data Privacy

### Sensitive Data Storage

**Student Data:**
- Full name, email, phone
- Passport information (in DS-160 data)
- Academic records
- Financial information (payments)

**Storage:**
- All stored in Supabase PostgreSQL
- Encrypted at rest (Supabase default)
- Encrypted in transit (HTTPS)

### PII Access Controls

- Students: Own data only
- Parents: Linked student data (read-only)
- Admins: All data (with audit trail)

### Data Retention

**Current Policy**: No automatic deletion

**Future Considerations:**
- GDPR compliance (if expanding to EU)
- Right to erasure implementation
- Data export functionality

---

## Error Handling

### Secure Error Messages

**Pattern:**
```typescript
// ✅ Good - Generic message to user
return NextResponse.json(
  { error: 'Failed to process request' },
  { status: 500 }
);

// ✅ Detailed logging server-side
console.error('Detailed error:', error);

// ❌ Bad - Exposes internal details
return NextResponse.json(
  { error: error.message, stack: error.stack },
  { status: 500 }
);
```

### Production Error Tracking

**Recommendations:**
- Use Sentry or similar service
- Log errors server-side
- Never expose stack traces to users
- Monitor failed auth attempts

---

## Security Checklist

### Pre-Production

- [x] All API routes require authentication
- [x] RLS policies on all tables
- [x] Input validation with Zod
- [x] File upload restrictions
- [x] No sensitive data in client code
- [x] `.env.example` template created
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Error monitoring setup

### Deployment

- [ ] Environment variables set in Vercel
- [ ] HTTPS enforced
- [ ] Database backups configured
- [ ] Security audit completed
- [ ] Access logs reviewed

### Ongoing Monitoring

- [ ] Review authentication logs weekly
- [ ] Monitor failed login attempts
- [ ] Check for unusual API activity
- [ ] Keep dependencies updated
- [ ] Review RLS policies quarterly

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: [admin email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work to patch critical issues immediately.

---

## References

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security/secure-software-development-lifecycle)

---

**Last Updated**: Sprint 10 - Hardening and Release
