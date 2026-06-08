"use strict";
// import twilio from "twilio"
// import dotenv from 'dotenv'
// dotenv.config()
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBillSMS = void 0;
// const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID
//     process.env.TWILIO_AUTH_TOKEN
// )
// export default client
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
exports.default = client;
const sendBillSMS = async (phone, amount) => {
    await client.messages.create({
        body: `Your hospital bill of ₹${amount} has been generated and sent to your email.`,
        from: process.env.TWILIO_PHONE,
        to: phone,
    });
};
exports.sendBillSMS = sendBillSMS;
