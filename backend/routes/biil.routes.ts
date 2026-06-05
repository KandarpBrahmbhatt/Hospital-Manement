import express from 'express'
import { billListing, dashboard } from '../controller/biil.aggregate'
import { createBill, createPaymentIntent, generateBillPDF, getAllBills } from '../controller/bill.controller'
const billRouter  = express.Router()

billRouter.post("/create", createBill)
billRouter.get("/pdf/:id",generateBillPDF)
billRouter.get("/bill",billListing)
billRouter.get("/list", getAllBills)
billRouter.get("/dashboard",dashboard)
billRouter.post("/create-payment-intent",createPaymentIntent);

export default billRouter