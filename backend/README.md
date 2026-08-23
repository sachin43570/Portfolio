# Portfolio Contact Form — Backend

This receives your contact form submissions and emails them straight to
your inbox using Nodemailer + Gmail SMTP.

## 1. Get a Gmail "App Password" (5 minutes, do this first)

Gmail blocks apps from using your normal password directly — you need a
separate 16-character "App Password."

1. Go to your Google Account → **Security**.
2. Turn on **2-Step Verification** if it isn't already on (required for App Passwords to be available).
3. Search settings for **"App passwords"** (or go directly to
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. Create one — name it something like "Portfolio Contact Form."
5. Google shows you a 16-character password **once**. Copy it.

## 2. Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=the-16-character-app-password-from-step-1
RECEIVING_EMAIL=sachinmaurya43570@gmail.com
PORT=5000
```

Run it:
```bash
node server.js
# → running on http://localhost:5000
```

Open your portfolio's `index.html` (with a local server, e.g.
`python3 -m http.server 8000` in the portfolio root — not by double-clicking
the file) and submit the contact form. You should get a real email within
seconds.

## 3. Deploy

**Backend → Render** (free tier):
1. Push this project to GitHub.
2. Render → New → Web Service → connect the repo → root directory `backend`.
3. Build command: `npm install`. Start command: `node server.js`.
4. Under **Environment**, add the same variables from your `.env`
   (`EMAIL_USER`, `EMAIL_PASS`, `RECEIVING_EMAIL`) — never commit `.env`
   itself to GitHub, that's what `.gitignore` is for.
5. Deploy. Copy the resulting URL.

**Frontend:** in `script.js` (in the portfolio root, not this backend
folder), replace `YOUR-BACKEND-URL.onrender.com` with your real Render URL.
Then redeploy your portfolio wherever it's hosted (Netlify, Vercel, GitHub
Pages, etc.) — a static host is enough since the portfolio itself has no
build step.

## Why it's built this way (for interviews, if this comes up)

- **Nodemailer + Gmail SMTP** instead of a paid email API (SendGrid, etc.)
  — free, and you already own the Gmail account, so no third-party service
  needs to be trusted with your form data.
- **Rate limiting** (`express-rate-limit`, 5 requests / 15 min per IP) —
  without this, anyone who finds your API URL could script thousands of
  requests, either spamming your inbox or getting your Gmail account
  flagged for abuse by Google.
- **Server-side validation** — the frontend already validates with HTML
  `required`/`type="email"`, but that's trivially bypassed by anyone
  calling the API directly (e.g. with `curl`), so the backend re-validates
  everything independently. Never trust the client.
- **HTML-escaping the message body** — prevents someone typing
  `<script>...</script>` as their message from injecting markup into the
  HTML email you read in your inbox.
- **`replyTo: email`** — hitting "Reply" on the email in your inbox replies
  directly to the visitor, not to your own Gmail sending address.
