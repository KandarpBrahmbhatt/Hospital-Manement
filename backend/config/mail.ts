import nodemailer from "nodemailer"

import dotenv from 'dotenv'
dotenv.config()

const emailUser = process.env.EMAIL?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");

// appoiment book and appoiment reminder mate mail send karva mate nodemailer no use kariyo 6e.
if (!emailUser || !emailPass) {
    console.log("Email credentials missing. Please set EMAIL and EMAIL_PASS in .env");
}

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPass
    }
})

export default transport

export const sendMail = async (
    to: string,
    subject: string,
    html: string,
    attachmentBuffer?: Buffer | Uint8Array,
    attachmentName?: string
) => {
    const mailOptions: any = {
        from: `Hospital Management <${emailUser}>`,
        to,
        subject,
        html
    }
    if (attachmentBuffer && attachmentName) {
        mailOptions.attachments = [
            {
                filename: attachmentName,
                content: attachmentBuffer
            }
        ]
    }
    return transport.sendMail(mailOptions)
}

export const verifyMailConnection = async () => {
    await transport.verify()
}

export const sendBillEmail = async (
    email: string,
    patientName: string,
    pdfBuffer: Buffer
) => {
    await transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Hospital Invoice",
        html: `
      <h2>Hello ${patientName}</h2>
      <p>Your hospital invoice is attached.</p>
      <p>Thank you for visiting our hospital.</p>
    `,
        attachments: [
            {
                filename: "Hospital-Bill.pdf",
                content: pdfBuffer,
            },
        ],
    });
};