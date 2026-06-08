"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBillEmail = exports.verifyMailConnection = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const emailUser = process.env.EMAIL?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");
// appoiment book and appoiment reminder mate mail send karva mate nodemailer no use kariyo 6e.
if (!emailUser || !emailPass) {
    console.log("Email credentials missing. Please set EMAIL and EMAIL_PASS in .env");
}
const transport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});
exports.default = transport;
const sendMail = async (to, subject, html, attachmentBuffer, attachmentName) => {
    const mailOptions = {
        from: `Hospital Management <${emailUser}>`,
        to,
        subject,
        html
    };
    if (attachmentBuffer && attachmentName) {
        mailOptions.attachments = [
            {
                filename: attachmentName,
                content: attachmentBuffer
            }
        ];
    }
    return transport.sendMail(mailOptions);
};
exports.sendMail = sendMail;
const verifyMailConnection = async () => {
    await transport.verify();
};
exports.verifyMailConnection = verifyMailConnection;
const sendBillEmail = async (email, patientName, pdfBuffer) => {
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
exports.sendBillEmail = sendBillEmail;
