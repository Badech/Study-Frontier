# Release Checklist

**Study Frontier** - Production Deployment Checklist

---

## Pre-Deployment Checklist

### 1. Code Quality ✅

- [x] TypeScript build succeeds without errors
- [x] No ESLint errors
- [x] All TODOs documented and tracked
- [x] Code reviewed for security issues
- [x] Sensitive data removed from code
- [x] No hardcoded credentials

### 2. Environment Configuration 🔧

- [ ] `.env.example` file is up to date
- [ ] All required environment variables documented
- [ ] Production environment variables set in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` points to production domain
- [ ] Supabase project configured for production
- [ ] PayPal configured for live mode (if using)

**Required Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
PAYPAL_CLIENT_ID= (optional)
PAYPAL_CLIENT_SECRET= (optional)
PAYPAL_MODE=live (optional)
```

### 3. Database Setup 🗄️

- [ ] Supabase project created (production)
- [ ] Database schema applied (`lib/supabase/schema.sql`)
- [ ] RLS policies applied (`lib/supabase/rls-policies.sql`)
- [ ] Auth triggers applied (`lib/supabase/auth-triggers.sql`)
- [ ] Storage buckets created (`lib/supabase/storage.sql`)
- [ ] Storage policies configured
- [ ] Database backups enabled
- [ ] First admin account created (see `docs/HOW-TO-CREATE-ADMIN.md`)

**Supabase Checklist:**
- [ ] Email auth enabled
- [ ] Email templates customized
- [ ] SMTP configured (or using Supabase default)
- [ ] Site URL configured in Supabase dashboard
- [ ] Redirect URLs whitelisted
- [ ] API rate limits reviewed

### 4. Security Audit 🔒

- [x] All API routes require authentication
- [x] RLS policies tested
- [x] File upload validation implemented
- [x] Input validation with Zod on all forms
- [x] No XSS vulnerabilities
- [x] CSRF protection enabled (Next.js default)
- [ ] Rate limiting considered
- [ ] Security headers configured
- [x] Service role key never exposed to client
- [x] Error messages don't leak sensitive info

**Security Review:**
- [ ] Review `docs/SECURITY.md`
- [ ] Test student cannot access other students' data
- [ ] Test parent role is read-only
- [ ] Test unauthenticated users blocked from all protected routes
- [ ] Test file upload restrictions

### 5. Functionality Testing 🧪

**Authentication:**
- [ ] User signup works
- [ ] Email verification works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works (if implemented)
- [ ] Role-based redirects work

**Student Portal:**
- [ ] Dashboard loads correctly
- [ ] Document upload works
- [ ] DS-160 form saves and loads
- [ ] DS-160 submission workflow works
- [ ] Visa prep checklist displays
- [ ] Applications display
- [ ] Payments display
- [ ] Notifications display

**Admin Dashboard:**
- [ ] Student list loads
- [ ] Student detail pages work
- [ ] Document review works
- [ ] DS-160 review works
- [ ] Payment creation works
- [ ] Payment approval works
- [ ] CMS editor works (if implemented)
- [ ] Lead management works
- [ ] Task management works
- [ ] Appointments display

**Parent Portal:**
- [ ] Parent can view linked student
- [ ] Parent cannot edit anything
- [ ] Overview page displays correctly

**Marketing Site:**
- [ ] Homepage loads
- [ ] Contact form works
- [ ] Language switching works (EN/FR/AR)
- [ ] RTL layout works for Arabic
- [ ] All links work

### 6. Accessibility ♿

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present on interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Error messages are accessible

### 7. Mobile Responsiveness 📱

**Test on actual devices or browser DevTools:**

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

**Student Portal (mobile-first):**
- [ ] Dashboard readable on mobile
- [ ] Forms usable on mobile
- [ ] Document upload works on mobile
- [ ] Touch targets adequate size (min 44x44px)
- [ ] Navigation works on mobile

**Admin Dashboard (mobile-usable):**
- [ ] Navigation accessible on mobile
- [ ] Student list readable
- [ ] Quick actions available
- [ ] Tables scroll horizontally if needed

### 8. Performance ⚡

- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Images optimized
- [ ] No console errors in production
- [ ] No console warnings in production
- [ ] Bundle size reasonable

**Test URLs:**
- Homepage: `pnpm build && pnpm start`
- Run Lighthouse on: `/`, `/dashboard`, `/admin`

### 9. Internationalization (i18n) 🌍

- [ ] English translations complete
- [ ] French translations complete
- [ ] Arabic translations complete
- [ ] RTL layout works for Arabic
- [ ] Language switcher works
- [ ] Date formatting locale-aware
- [ ] Currency formatting correct

**Test:**
- [ ] Switch between languages
- [ ] Verify all text is translated
- [ ] Check for missing translation keys

### 10. Data & Content ✍️

- [ ] Remove test/dummy data from database
- [ ] CMS content reviewed and approved
- [ ] FAQ content added
- [ ] Email templates configured
- [ ] Terms of Service added (if needed)
- [ ] Privacy Policy added (if needed)

---

## Deployment Steps

### Vercel Deployment

**1. Connect Repository**
```bash
# Push to GitHub (if not already)
git push origin main
```

**2. Import to Vercel**
- Go to [Vercel Dashboard](https://vercel.com/new)
- Import Git repository
- Select the `study-frontier` repository

**3. Configure Project**
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node Version**: 20.x

**4. Set Environment Variables**
Copy all variables from `.env.local` to Vercel:
- Go to Project Settings > Environment Variables
- Add each variable
- Set for Production, Preview, and Development

**5. Deploy**
- Click "Deploy"
- Wait for build to complete
- Verify deployment

**6. Configure Domain**
- Add custom domain in Vercel
- Update DNS records
- Wait for SSL certificate
- Update `NEXT_PUBLIC_SITE_URL` to production domain

**7. Update Supabase URLs**
- Go to Supabase Dashboard > Authentication > URL Configuration
- Add production URL to "Site URL"
- Add production URL to "Redirect URLs"

### Post-Deployment Verification

- [ ] Visit production URL
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test student portal
- [ ] Test admin dashboard
- [ ] Check Vercel logs for errors
- [ ] Check Supabase logs for errors
- [ ] Test on mobile device

---

## Database Migration (If Updating Existing)

If deploying updates to an existing production database:

**1. Backup First**
```bash
# In Supabase Dashboard:
# Database > Backups > Create Backup
```

**2. Test Migrations Locally**
```bash
# Run migration SQL in local Supabase
# Verify no breaking changes
```

**3. Apply to Production**
```bash
# In Supabase SQL Editor:
# Run migration scripts carefully
# Check for errors
```

**4. Verify Data Integrity**
- [ ] Check all tables
- [ ] Verify RLS policies
- [ ] Test data access

---

## Monitoring & Post-Launch

### First 24 Hours

- [ ] Monitor Vercel logs for errors
- [ ] Monitor Supabase logs for errors
- [ ] Check analytics for traffic
- [ ] Test all critical user flows
- [ ] Monitor API response times
- [ ] Check database query performance

### First Week

- [ ] Review user feedback
- [ ] Monitor error rates
- [ ] Check email deliverability
- [ ] Review authentication logs
- [ ] Monitor storage usage
- [ ] Check payment processing (if live)

### Ongoing

- [ ] Weekly security audit
- [ ] Monthly dependency updates
- [ ] Quarterly RLS policy review
- [ ] Regular database backups
- [ ] Performance monitoring
- [ ] User feedback collection

---

## Rollback Plan

If something goes wrong:

**Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "..." menu
4. Select "Promote to Production"

**Database:**
1. Go to Supabase Dashboard
2. Database > Backups
3. Restore from backup
4. Verify data

**Code:**
```bash
# Revert to last working commit
git revert HEAD
git push origin main
```

---

## Support & Maintenance

### Regular Maintenance

- **Weekly**: Review logs, check errors
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Full security audit, performance review

### Dependency Updates

```bash
# Check for updates
pnpm outdated

# Update dependencies
pnpm update

# Test after updates
pnpm build
pnpm dev
```

### Security Updates

- Enable GitHub Dependabot alerts
- Review Supabase security announcements
- Monitor Next.js security advisories
- Update immediately for critical patches

---

## Contact Information

**Production Issues:**
- Email: [admin email]
- Emergency: [phone number]

**Service Status:**
- Vercel: https://vercel-status.com
- Supabase: https://status.supabase.com

---

## Sign-off

**Project Manager:** _________________ Date: _______

**Technical Lead:** _________________ Date: _______

**QA Lead:** _________________ Date: _______

---

**Last Updated**: Sprint 10 - Hardening and Release
