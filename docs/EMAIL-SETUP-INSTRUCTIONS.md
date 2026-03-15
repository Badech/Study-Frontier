# Email Service Setup Instructions
**For Study Frontier Production Deployment**

## ✅ Quick Setup Checklist

- [ ] Create Resend account
- [ ] Add and verify domain
- [ ] Add DNS records (SPF, DKIM, DMARC)
- [ ] Generate API key
- [ ] Add environment variables to production
- [ ] Test email sending
- [ ] Verify emails don't go to spam

**Estimated Time:** 30-60 minutes

---

## Step 1: Create Resend Account (5 minutes)

1. Go to **https://resend.com**
2. Click "Sign Up"
3. Use your **contact@studyfrontier.com** email
4. Verify your email address
5. Complete account setup

**Free Tier Limits:**
- 100 emails/day
- 3,000 emails/month
- Perfect for initial launch and testing

---

## Step 2: Add Your Domain (10 minutes)

### In Resend Dashboard:

1. Go to **Domains** section
2. Click **"Add Domain"**
3. Enter your domain: `studyfrontier.com`
4. Resend will provide DNS records to add

### DNS Records You'll Need to Add:

Resend will give you specific values, but they'll look like this:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

**DKIM Record:**
```
Type: TXT  
Name: resend._domainkey
Value: [Provided by Resend - long string]
TTL: 3600
```

**DMARC Record (Recommended):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@studyfrontier.com
TTL: 3600
```

### Where to Add DNS Records:

1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
2. Go to DNS Management / DNS Settings
3. Add each record as shown above
4. Wait 5-30 minutes for propagation

### Verify Domain in Resend:

1. After adding DNS records, go back to Resend
2. Click **"Verify Domain"**
3. Wait for verification (usually instant, max 24 hours)
4. Status should show **"Verified" ✅**

---

## Step 3: Generate API Key (2 minutes)

1. In Resend dashboard, go to **API Keys**
2. Click **"Create API Key"**
3. Name it: `Study Frontier Production`
4. **Copy the key** - it starts with `re_`
5. **Save it securely** - you won't see it again!

**Example:** `re_123ABC456def789GHI012jkl345MNO678pqr`

---

## Step 4: Configure Environment Variables

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:

**Variable 1:**
```
Name: RESEND_API_KEY
Value: re_your_actual_api_key_here
Environment: Production (and Preview if testing)
```

**Variable 2:**
```
Name: RESEND_FROM_EMAIL
Value: Study Frontier <noreply@studyfrontier.com>
Environment: Production (and Preview if testing)
```

**Variable 3 (if not already set):**
```
Name: NEXT_PUBLIC_APP_URL
Value: https://studyfrontier.com
Environment: Production
```

4. Click **Save**
5. **Redeploy** your application for changes to take effect

### For Local Development:

Add to your `.env.local` file:
```env
RESEND_API_KEY=re_your_actual_api_key
RESEND_FROM_EMAIL=Study Frontier <noreply@studyfrontier.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5: Test Email Sending

### Method 1: Test via Admin Panel (Recommended)

1. Log in to admin dashboard
2. Go to a student's documents
3. Approve a document
4. Check if approval email is sent
5. Verify email arrives in inbox (not spam)

### Method 2: Test via API Route

Create a test file: `test-email.js`

```javascript
async function testEmail() {
  const response = await fetch('http://localhost:3000/api/test-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'your-test-email@example.com',
      subject: 'Test Email from Study Frontier',
    }),
  });
  
  const result = await response.json();
  console.log('Result:', result);
}

testEmail();
```

### What to Check:

- ✅ Email arrives within 1-2 minutes
- ✅ Email doesn't go to spam folder
- ✅ Sender shows as "Study Frontier <noreply@studyfrontier.com>"
- ✅ Professional appearance with branding
- ✅ Links work correctly
- ✅ Mobile-responsive design

---

## Step 6: Troubleshooting

### Email Not Sending?

**Check 1: Environment Variables**
```bash
# In Vercel, check if variables are set correctly
# Should show: RESEND_API_KEY=re_***
```

**Check 2: Domain Verification**
- Go to Resend dashboard → Domains
- Status should be "Verified" ✅
- If not, check DNS records

**Check 3: API Key Validity**
- Regenerate API key if needed
- Update environment variables
- Redeploy application

**Check 4: Application Logs**
- Check Vercel logs for errors
- Look for "Email sent successfully" messages
- Look for any Resend API errors

### Emails Going to Spam?

**Solution 1: Warm Up Domain**
- Start with low volume (5-10 emails/day)
- Gradually increase over 2 weeks
- This builds sender reputation

**Solution 2: Check DNS Records**
- Verify SPF record is correct
- Verify DKIM record is correct
- Add DMARC record if missing

**Solution 3: Email Content**
- Avoid spam trigger words ("free", "win", "click here")
- Include physical address in footer
- Add unsubscribe link (future enhancement)

**Solution 4: Ask Recipients to Whitelist**
- Add noreply@studyfrontier.com to contacts
- Mark as "Not Spam" if it goes to spam folder

---

## Step 7: Monitor Email Health

### Resend Dashboard Metrics:

1. **Delivery Rate** - Should be >95%
2. **Open Rate** - Typically 20-40%
3. **Bounce Rate** - Should be <5%
4. **Spam Reports** - Should be 0%

### Check Daily For First Week:

- Are emails being delivered?
- Any bounces or failures?
- Response rate from students?

---

## Production Checklist

Before going live with email notifications:

- [ ] Domain verified in Resend (green checkmark)
- [ ] All DNS records added and propagated
- [ ] API key generated and saved
- [ ] Environment variables set in Vercel
- [ ] Test email sent and received successfully
- [ ] Email doesn't go to spam
- [ ] Professional appearance confirmed
- [ ] Links in email work correctly
- [ ] Mobile view looks good
- [ ] Contact email (contact@studyfrontier.com) monitored

---

## Email Types Currently Configured

✅ Welcome email - New student signup  
✅ Assessment received - After eligibility form  
✅ Document approved - Admin approves document  
✅ Document needs correction - Admin requests revision  
✅ Stage changed - Student progresses to new stage  
✅ Payment due - Payment reminder  
✅ Payment received - Payment confirmation  
✅ Appointment booked - Appointment confirmation  
✅ Appointment reminder - 24h before appointment  
✅ New message - Message notification  

**All templates are professional, mobile-responsive, and include:**
- Study Frontier branding
- Clear call-to-action buttons
- Footer with privacy/terms links
- "Reply to: contact@studyfrontier.com"

---

## Rate Limits & Costs

### Resend Free Tier:
- **100 emails/day**
- **3,000 emails/month**
- **Unlimited** sender domains
- **Perfect for:** Initial launch, up to ~100 active students

### When to Upgrade to Pro ($20/month):
- More than 100 emails/day
- Need 50,000 emails/month
- Want email analytics
- Need priority support

**Estimate:** With 50 students, expect ~200-400 emails/month (well within free tier)

---

## Support

### If You Need Help:

1. **Resend Documentation:** https://resend.com/docs
2. **Resend Support:** support@resend.com
3. **Status Page:** https://resend.com/status
4. **Community:** https://resend.com/discord

### Common Questions:

**Q: Can I use a different from email?**  
A: Yes, but it must be from your verified domain (e.g., hello@studyfrontier.com, notifications@studyfrontier.com)

**Q: How do I change the from name?**  
A: Update `RESEND_FROM_EMAIL` to: `Your Name <email@studyfrontier.com>`

**Q: Can I send to multiple recipients?**  
A: Yes, pass an array: `to: ['email1@example.com', 'email2@example.com']`

**Q: What about unsubscribe links?**  
A: Not currently implemented. Will add in Phase 3 enhancement.

---

## Next Steps After Setup

Once email is working:

1. ✅ Monitor delivery rates for first week
2. ✅ Gather feedback from students on email quality
3. ✅ Check spam folder placement
4. ✅ Consider adding email analytics (Phase 3)
5. ✅ Implement unsubscribe functionality (Phase 3)

---

**Setup completed by:** _________________  
**Date:** _________________  
**Verification test passed:** [ ] Yes [ ] No  
**Notes:** ________________________________
