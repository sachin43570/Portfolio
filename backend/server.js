const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


// Test route
app.get("/", (req, res) => {
    res.send("Portfolio backend is running!");
});


// Contact form route
app.post("/send-message", async (req, res) => {

    try {

        const { name, email, message } = req.body;

        // Check required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }


        // Email sent to YOUR Gmail
        const mailOptions = {
            from: process.env.GMAIL_USER,

            to: process.env.GMAIL_USER,

            replyTo: email,

            subject: `Portfolio Contact: ${name}`,

            text: `
You received a new message from your portfolio.

Name: ${name}

Email: ${email}

Message:
${message}
            `,

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
        };


        // Send email
        await transporter.sendMail(mailOptions);


        res.json({
            success: true,
            message: "Message sent successfully!"
        });


    } catch (error) {

        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });

    }

});


app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});