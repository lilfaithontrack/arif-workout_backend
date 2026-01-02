# Fix Email Delivery to Gmail

## Problem
Emails are being sent successfully from your SMTP server but not reaching Gmail inboxes.

## Root Cause
Gmail is likely filtering/rejecting emails from `arifworkout.com` due to:
1. Missing SPF/DKIM records
2. Low domain reputation
3. Gmail's strict filtering for new domains

## Solution 1: Add SPF Record (Recommended)

### In Space Square cPanel:

1. Go to **DNS Zone Editor** or **Advanced DNS Zone Editor**
2. Add a new TXT record:
   ```
   Type: TXT
   Name: @ (or leave blank for root domain)
   TTL: 3600 (or default)
   Value: v=spf1 a mx ip4:91.204.209.46 ~all
   ```
3. Save the record
4. Wait 5-10 minutes for DNS propagation

### Verify SPF Record:
```bash
nslookup -type=TXT arifworkout.com
```

## Solution 2: Add DKIM Record

1. In cPanel, go to **Email** > **Email Authentication**
2. Enable **DKIM** if available
3. Copy the DKIM public key
4. Add it as a TXT record in DNS:
   ```
   Type: TXT
   Name: default._domainkey (or as shown in cPanel)
   Value: [DKIM public key from cPanel]
   ```

## Solution 3: Use Transactional Email Service (Best for Production)

### Option A: SendGrid (Free tier: 100 emails/day)

1. Sign up at https://sendgrid.com
2. Get API key
3. Update `.env`:
   ```env
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=your-sendgrid-api-key
   EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"
   ```

### Option B: Mailgun (Free tier: 5,000 emails/month)

1. Sign up at https://mailgun.com
2. Verify domain
3. Get SMTP credentials
4. Update `.env`:
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=postmaster@mg.arifworkout.com
   EMAIL_PASSWORD=your-mailgun-password
   ```

### Option C: AWS SES (Very cheap, pay per email)

1. Set up AWS SES
2. Verify domain
3. Get SMTP credentials
4. Update `.env` with AWS SES SMTP settings

## Solution 4: Check cPanel Mail Queue

1. Log into cPanel
2. Go to **Email** > **Mail Queue Manager** or **Track Delivery**
3. Check if emails are:
   - Queued (waiting to send)
   - Failed (rejected by Gmail)
   - Bounced (returned)

## Solution 5: Test with Different Email Provider

Test if it's Gmail-specific by sending to:
- Yahoo Mail
- Outlook
- Another email provider

If other providers receive emails but Gmail doesn't, it's a Gmail filtering issue.

## Quick Test After Adding SPF

After adding SPF record, wait 10 minutes, then:
```bash
node scripts/send-simple-test-email.js
```

## Current Status

✅ SMTP server working
✅ Authentication successful  
✅ Emails accepted by server
❌ Gmail not receiving emails

## Next Steps

1. **Immediate**: Add SPF record in DNS
2. **Short-term**: Consider using SendGrid/Mailgun
3. **Long-term**: Set up proper email authentication (SPF, DKIM, DMARC)

