const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

app.get("/", (req, res) => {
  res.send("Portfolio backend is running!");
  
});

// Contact form route — receives the visitor's message and emails it to you
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill all fields." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`, // must be your own address for Gmail to accept it
      to: process.env.GMAIL_USER,       // you receive it
      replyTo: email,                   // hit "Reply" to answer the visitor directly
      subject: `Portfolio Contact: ${name}`,
      text: `You received a new message from your portfolio.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<h2>New Portfolio Contact</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p><hr><p>You can reply directly to this email to contact ${name}.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});