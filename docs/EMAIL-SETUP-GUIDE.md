# Email Service Setup Guide
**Resend Integration for Study Frontier**

## Quick Start (5 minutes)

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up with your email
3. Verify your email address

### Step 2: Add and Verify Your Domain
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `studyfrontier.com`)
4. Add the provided DNS records to your domain:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
5. Wait for verification (usually 5-10 minutes)

### Step 3: Generate API Key
1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name it: "Study Frontier Production"
4. Copy the key (starts with `re_`)

### Step 4: Configure Environment Variables
Add to your `.env.local`:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=Study Frontier <noreply@studyfrontier.com>
NEXT_PUBLIC_APP_URL=https://studyfrontier.com
```

### Step 5: Test Email Sending
Use the test script or trigger a notification in your app:

```bash
# Test by approving a document in admin panel
# Check Resend dashboard for delivery status
```

---

## DNS Records Setup

### Required DNS Records (add to your domain provider):

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record:**
```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

**DMARC Record (Recommended):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@studyfrontier.com
```

---

## For Development/Testing

If you don't have a domain yet, you can use Resend's test domain:

```env
RESEND_API_KEY=re_your_test_api_key
RESEND_FROM_EMAIL=Study Frontier <onboarding@resend.dev>
```

**Note:** Emails from `resend.dev` may go to spam. Use only for testing.

---

## Email Types Configured

✅ Welcome email - New student signup  
✅ Assessment received - Confirmation  
✅ Document approved - Approval notification  
✅ Document needs correction - Revision request  
✅ Stage changed - Progress update  
✅ Payment due - Payment reminder  
✅ Payment received - Confirmation  
✅ Appointment booked - Confirmation  
✅ Appointment reminder - 24h before  
✅ New message - Message notification  

---

## Troubleshooting

### Emails not sending?
1. Check if `RESEND_API_KEY` is set
2. Check if `RESEND_FROM_EMAIL` is set
3. Verify your domain is verified in Resend
4. Check Resend dashboard for delivery logs
5. Check application logs for errors

### Emails going to spam?
1. Verify all DNS records are correct
2. Add DMARC record
3. Warm up your domain (send gradually increasing volumes)
4. Ensure "from" email matches verified domain

### Configuration check:
```typescript
import { isEmailConfigured } from '@/lib/email/resend';

if (!isEmailConfigured()) {
  console.log('Email service not configured');
}
```

---

## Production Checklist

Before going live:

- [ ] Domain verified in Resend
- [ ] All DNS records added and verified
- [ ] API key added to production environment
- [ ] Test email sent successfully
- [ ] From email matches verified domain
- [ ] Unsubscribe link added (future enhancement)
- [ ] Email analytics configured (optional)
- [ ] Rate limits understood (Resend free tier: 100 emails/day)

---

## Rate Limits & Pricing

### Resend Free Tier:
- 100 emails/day
- 3,000 emails/month
- Perfect for testing and small deployments

### Resend Pro ($20/month):
- 50,000 emails/month
- Unlimited daily sending
- Email analytics
- Priority support

**Recommendation:** Start with free tier, upgrade when needed.

---

## Support

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **Status Page:** https://resend.com/status

---

## Alternative: SendGrid (Not Currently Used)

If you prefer SendGrid:

1. Create SendGrid account
2. Verify sender identity
3. Generate API key
4. Update `lib/email/` to use SendGrid SDK
5. Update environment variables

**Note:** Current implementation uses Resend. SendGrid integration requires code changes.
