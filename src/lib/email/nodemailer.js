
import nodemailer from "nodemailer";
import {env} from "../config/env.js";
// establish connection with Gmail
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: env.nodemailer.user,
            pass: env.nodemailer.pass,
        }
    });
export async function sendEmail(to, subject, html) {

    try {
        console.log("TO:", to);
        console.log("SUBJECT:", subject);
        console.log("HTML:", html);
        const info = await transporter.sendMail({
            from: `"NGL-APP" <${process.env.MAIL_EMAIL}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log("EMAIL SENT:", info.messageId);
        console.log("RESPONSE:", info.response);
        return info;
    } catch (error) {
        console.log("EMAIL ERROR:", error);
    }
}

console.log("EMAIL:", process.env.MAIL_EMAIL);
console.log("PASS EXISTS:", !!process.env.MAIL_PASS);
console.log("PASS LENGTH:", process.env.MAIL_PASS?.length);