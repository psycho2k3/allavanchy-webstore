const transporter = require("../config/mailer");

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

exports.sendContactMessage = async (req, res) => {

    try {

        const { firstName, lastName, email, subject, message } = req.body;

        if (!hasText(firstName) || !hasText(lastName) || !hasText(email) || !hasText(message)) {
            return res.status(400).json({
                message: "First name, last name, email, and message are required"
            });
        }

        if (
            !process.env.CONTACT_EMAIL_USER ||
            !process.env.CONTACT_EMAIL_APP_PASSWORD ||
            !process.env.CONTACT_RECEIVER_EMAIL
        ) {
            return res.status(500).json({
                message: "Contact email is not configured"
            });
        }

        await transporter.sendMail({
            from: process.env.CONTACT_EMAIL_USER,
            to: process.env.CONTACT_RECEIVER_EMAIL,
            replyTo: email,
            subject: `ALLAVANCHY Contact: ${subject || "New enquiry"}`,
            text: `From: ${firstName} ${lastName} (${email})\n\n${message}`
        });

        res.status(200).json({
            message: "Message sent successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });

    }

};