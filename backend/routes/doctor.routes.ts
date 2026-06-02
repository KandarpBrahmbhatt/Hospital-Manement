import express from 'express'
import { appointmentListing, doctorListing, patientListing } from '../controller/doctor.aggregate'

const doctorRouter  = express.Router()

doctorRouter.get("/doctor",doctorListing)
doctorRouter.get("/appointmentListing",appointmentListing)
doctorRouter.get("/patientListing",patientListing)

export default doctorRouter