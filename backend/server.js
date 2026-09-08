const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Resend } = require("resend");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
app.get("/", (req, res) => {
  res.send("Portfolio backend is running!");
});
// Contact form
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("Contact form received:", {
      name,
      email,
      message
    });
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields."
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.GMAIL_USER],
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `You received a new message from your portfolio.
Name: ${name}
Email: ${email}
Message:
${message}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>
          You can reply directly to this email to contact ${name}.
        </p>
      `
    });
    if (error) {
      console.error("Resend error:", error);
     return res.status(500).json({
        success: false,
        message: "Failed to send message."
      });
    }
    console.log("Email sent successfully:", data);
    return res.json({
      success: true,
      message: "Message sent successfully!"
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message."
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});