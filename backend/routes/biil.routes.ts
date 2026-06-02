import express from 'express'
import { billListing, dashboard } from '../controller/biil.aggregate'
import { generateBillPDF } from '../controller/bill.controller'
const billRouter  = express.Router()

billRouter.get("/pdf/:id",generateBillPDF)
billRouter.get("/bill",billListing)
billRouter.get("/dashboard",dashboard)
export default billRouter