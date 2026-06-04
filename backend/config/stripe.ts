import Stripe from "stripe";
import dotenv from 'dotenv'
dotenv.config()

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in .env");
}

const stripe = new Stripe(stripeSecretKey);

export default stripe; 
