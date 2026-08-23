// server.js
// Portfolio contact-form backend.
//
// Flow: browser POSTs { name, email, message } → this validates it →
// Nodemailer sends it as an email to YOUR_EMAIL using a Gmail account as
// the sender → you receive it in your inbox like any other email.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const YOUR_EMAIL = process.env.RECEIVING_EMAIL || 'sachinmaurya43570@gmail.com';

// ---------------------------------------------------------------------------
// Rate limiting — without this, anyone who finds your API URL could script
// thousands of requests and either spam your inbox or get your Gmail
// account flagged/suspended for abuse. 5 requests per 15 minutes per IP is
// generous for a real visitor, useless for a spammer.
// ---------------------------------------------------------------------------
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' }
});

// ---------------------------------------------------------------------------
// Nodemailer transporter — uses Gmail's SMTP with an "App Password"
// (NOT your normal Gmail password — see backend/README.md for setup).
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // ---- Validation ----
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' });
  }
  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ error: 'Name or message is too long.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: YOUR_EMAIL,
      replyTo: email, // hitting "Reply" in your inbox replies straight to the visitor
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px;">
          <h2 style="color:#0f1628;">New message from your portfolio</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Message:</b></p>
          <p style="white-space: pre-wrap; background:#f1f5f9; padding:12px; border-radius:6px;">${escapeHtml(message)}</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Basic HTML-escaping so a message containing "<script>" can't inject markup
// into the email you read in your inbox.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Contact form backend running on http://localhost:${PORT}`);
});
