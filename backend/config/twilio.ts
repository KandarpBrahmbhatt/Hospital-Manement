// import twilio from "twilio"
// import dotenv from 'dotenv'
// dotenv.config()

// const client = twilio(
//     process.env.TWILIO_ACCOUNT_SID
//     process.env.TWILIO_AUTH_TOKEN
// )

// export default client

import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export default client;


export const sendBillSMS = async (
  phone: string,
  amount: number
) => {
  await client.messages.create({
    body: `Your hospital bill of ₹${amount} has been generated and sent to your email.`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};