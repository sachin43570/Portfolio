// script.js
// Your contact form had no `action` and no JS — submitting it just reloaded
// the page and did nothing. This intercepts the submit, POSTs it to your
// backend, and shows a real success/error message to the visitor.

// Change this to your deployed backend URL once it's live (see backend/README.md)
const CONTACT_API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api/contact'
  : 'https://YOUR-BACKEND-URL.onrender.com/api/contact';

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  try {
    const res = await fetch(CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    statusEl.textContent = "Message sent — thanks! I'll get back to you soon.";
    statusEl.className = 'form-status success';
    form.reset();
  } catch (err) {
    statusEl.textContent = `Couldn't send: ${err.message}`;
    statusEl.className = 'form-status error';
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
  }
});
