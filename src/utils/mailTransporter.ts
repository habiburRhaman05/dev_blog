
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: 'gmail',
  port: 465,         // Corrected from 547
  secure: true,     // Required for port 587; set to true ONLY for port 465
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD 
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export const mailTransport = transporter

