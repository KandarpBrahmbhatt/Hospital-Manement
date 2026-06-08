"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("../config/twilio"));
const sendSMS = async (phone, message) => {
    try {
        const sms = await twilio_1.default.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log("SMS Sent:", sms.sid);
        return sms;
    }
    catch (error) {
        console.error("sendSMS error:", error);
        throw error;
    }
};
exports.sendSMS = sendSMS;
