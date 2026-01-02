# Space Square Mail Server Configuration

## Finding Your Mail Server

Since your domain uses A records to point to Space Square hosting, you need to find the correct mail server hostname.

### Step 1: Log into cPanel

1. Log into your Space Square cPanel
2. Go to **Email Accounts** section

### Step 2: Find Mail Server Settings

1. Click on your email account (`support@arifworkout.com`)
2. Look for **"Connect Devices"** or **"Mail Client Configuration"** or **"Email Client Manual Settings"**
3. You'll see settings like:

```
Outgoing Server: mail.arifworkout.com
SMTP Port: 465
SMTP Authentication: Required
```

### Step 3: Common Space Square Mail Server Formats

The mail server is usually one of these:

- `mail.arifworkout.com` (most common)
- `smtp.arifworkout.com`
- `mail.spacesquare.com`
- `smtp.spacesquare.com`
- `arifworkout.com` (if mail is on main domain)

### Step 4: Update Your .env File

Once you find the correct mail server, update your `.env` file:

```env
EMAIL_HOST=mail.arifworkout.com  # Use the hostname from Step 2
EMAIL_PORT=465                    # Usually 465 (SSL) or 587 (TLS)
EMAIL_SECURE=true                 # true for port 465, false for port 587
EMAIL_USER=support@arifworkout.com
EMAIL_PASSWORD="Kalebeyasu123@#"
EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"
```

### Step 5: Test the Configuration

Run the test script:
```bash
node scripts/test-smtp-diagnostic.js
```

## Alternative: Use Mail Subdomain

If `mail.arifworkout.com` doesn't exist, you may need to:

1. Create a mail subdomain in cPanel
2. Point it to the same IP as your main domain
3. Use `mail.arifworkout.com` as EMAIL_HOST

## Troubleshooting

### If emails still don't arrive:

1. **Check cPanel Email Routing:**
   - cPanel > Email Routing
   - Make sure it's set to "Local Mail Exchanger"

2. **Check DNS Records:**
   - Ensure MX records point to your mail server
   - Or use hosting provider's mail server

3. **Check Firewall:**
   - Port 465 or 587 should be open
   - Contact Space Square support if needed

4. **Test with cPanel Webmail:**
   - Try sending an email from cPanel webmail
   - If that works, the mail server is correct

## Quick Update Script

Run this to update your mail server:
```bash
node scripts/update-smtp-config.js
```

Then manually edit `.env` to set the correct `EMAIL_HOST` from your cPanel.

