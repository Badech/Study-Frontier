# How to Create an Admin Account

## Current Implementation (MVP Phase)

During the MVP phase, admin accounts must be created manually via the Supabase dashboard. The `/signup/admin` page is currently a placeholder for future implementation.

---

## Method 1: Create Admin via Supabase Dashboard (Recommended for MVP)

### Step 1: Sign Up as Regular User First
1. Go to your app: `http://localhost:3000/signup`
2. Fill in the signup form with the admin's details:
   - Full Name
   - Email
   - Password
   - Phone (optional)
   - WhatsApp (optional)
3. Complete the signup process

### Step 2: Verify Email (if email confirmation is enabled)
1. Check the email inbox
2. Click the verification link
3. Email will be marked as verified in Supabase

### Step 3: Update Role to Admin in Supabase
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user you just created
4. Click on the user to open their details
5. Go to the **Raw User Meta Data** section or use the SQL Editor

### Step 4: Run SQL to Update Role

**Option A: Via SQL Editor (Easiest)**

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Run this SQL:

```sql
-- Replace 'user@example.com' with the actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

4. Verify the update:

```sql
-- Check the user's role
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE email = 'user@example.com';
```

You should see the role changed to `'admin'`.

**Option B: Direct Database Update**

1. Go to **Table Editor** → **profiles** table
2. Find the user by email
3. Click on the row
4. Change the `role` field from `'student'` to `'admin'`
5. Save changes

---

## Method 2: Create Admin Directly in Database (Advanced)

If you want to create an admin account directly without going through the signup form:

### Step 1: Create Auth User in Supabase

1. Go to **Authentication** → **Users**
2. Click **Add user** (invite via email or create manually)
3. Fill in:
   - Email
   - Password (auto-generate or set manually)
   - Email confirmation: Choose whether to require confirmation
4. Click **Create user**

### Step 2: Create Profile with Admin Role

1. Go to **SQL Editor**
2. Run this SQL (replace values with actual data):

```sql
-- Get the user's auth.uid first
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Then create the profile with admin role
INSERT INTO public.profiles (id, email, full_name, role, phone, whatsapp)
VALUES (
  'USER_AUTH_UID_HERE',  -- Replace with the actual UUID from above query
  'admin@example.com',
  'Admin Full Name',
  'admin',
  '+212600000000',       -- Optional
  '+212600000000'        -- Optional
);
```

---

## Method 3: Using SQL Function (Automated)

Create a helper SQL function to promote users to admin:

### Step 1: Create the Function

Run this in **SQL Editor**:

```sql
-- Function to promote a user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for testing)
-- In production, restrict this to specific service role only
GRANT EXECUTE ON FUNCTION promote_to_admin(TEXT) TO authenticated;
```

### Step 2: Use the Function

```sql
-- Promote a user to admin
SELECT promote_to_admin('user@example.com');
```

### Step 3: Verify

```sql
-- Check the user's role
SELECT email, full_name, role FROM public.profiles WHERE email = 'user@example.com';
```

---

## Verifying Admin Access

After creating an admin account:

### 1. Login to the Application
1. Go to `http://localhost:3000/login`
2. Enter the admin's email and password
3. Click **Sign In**

### 2. Access Admin Dashboard
1. After login, you should be redirected to `/admin`
2. If not, manually navigate to `http://localhost:3000/admin`
3. You should see the full admin dashboard with:
   - Key metrics
   - Tasks needing attention
   - Students by stage
   - Recent activity
   - Navigation sidebar with: Dashboard, Leads, Students, Tasks, Appointments

### 3. Test Admin Permissions
Try accessing these admin-only routes:
- `/admin` - Dashboard
- `/admin/leads` - Lead management
- `/admin/students` - Student management
- `/admin/tasks` - Tasks
- `/admin/appointments` - Appointments

If you see these pages without being redirected to login, your admin account is working correctly!

---

## Troubleshooting

### Problem: Can't access /admin after creating admin account

**Solution 1: Check the role in database**
```sql
SELECT id, email, role FROM public.profiles WHERE email = 'your-email@example.com';
```
The `role` should be `'admin'` (not `'student'`).

**Solution 2: Clear session and re-login**
1. Sign out of the application
2. Clear browser cookies/local storage
3. Sign in again with the admin credentials

**Solution 3: Check RLS policies**
```sql
-- Verify RLS policies allow admin access
SELECT * FROM public.profiles WHERE id = auth.uid() AND role = 'admin';
```

### Problem: Getting redirected to /login when accessing /admin

This means the authentication isn't working properly:

1. Check if you're logged in:
   - Look for a session cookie
   - Try accessing `/debug-auth` to see current user info

2. Verify the profile exists:
```sql
SELECT * FROM public.profiles WHERE email = 'your-admin-email@example.com';
```

3. Check auth trigger is working:
```sql
-- The trigger should auto-create profiles on signup
-- Verify it exists:
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

---

## Future Implementation (Post-MVP)

In future sprints, the admin signup will be implemented with:

1. **Invite Token System**
   - Admins can generate invite links
   - Token expires after 7 days
   - One-time use only

2. **Admin Invite Flow**
   - Current admin sends invite via email
   - Recipient clicks link with token
   - Fills out signup form
   - Account automatically created with admin role

3. **Security Features**
   - Email domain restrictions (e.g., only @studyfrontier.com)
   - Two-factor authentication for admin accounts
   - Audit log of admin account creation

---

## Quick Reference Commands

### Create admin from existing user:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'user@example.com';
```

### List all admins:
```sql
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE role = 'admin' 
ORDER BY created_at DESC;
```

### Demote admin to student:
```sql
UPDATE public.profiles SET role = 'student' WHERE email = 'user@example.com';
```

### Create counselor (staff role):
```sql
UPDATE public.profiles SET role = 'counselor' WHERE email = 'staff@example.com';
```

### Count users by role:
```sql
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role;
```

---

## Security Notes

⚠️ **Important for Production:**

1. **Never expose admin creation endpoints publicly**
2. **Use invite tokens with expiration**
3. **Implement email domain restrictions**
4. **Enable MFA for all admin accounts**
5. **Log all admin account creation events**
6. **Restrict the `promote_to_admin` function to service role only**
7. **Regularly audit admin accounts**

---

## Summary

**For MVP (Current)**:
1. Sign up normally at `/signup`
2. Update role to `'admin'` via Supabase SQL Editor
3. Login and access `/admin`

**For Production (Future)**:
- Implement invite token system
- Use `/signup/admin?token=xxx` with validation
- Auto-assign admin role on signup with valid token

That's it! You now have an admin account and can access the full admin dashboard. 🎉
