const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// TODO: Replace with your own SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY');

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const msg = {
        to: 'ajuakarjun@gmail.com', // Your receiving email address
        from: 'your-verified-sender@example.com', // TODO: Replace with a verified sender email address in your SendGrid account
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Email sent');
            res.status(200).send('Message sent successfully!');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email. Please try again later.');
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});