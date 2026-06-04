import client from "../config/twilio";

export const sendSMS = async (
  phone: string,
  message: string
) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log("SMS Sent:", sms.sid);

    return sms;
  } catch (error) {
    console.error("sendSMS error:", error);
    throw error;
  }
};