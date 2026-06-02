import express from 'express'
import { billListing, dashboard } from '../controller/biil.aggregate'
import { createPatient, getPatientList, getSinglePatient, updatePatient } from '../controller/patitentCRUD'

const patientRouter  = express.Router()

patientRouter.post("/create",createPatient)
patientRouter.get("/getPatientList",getPatientList)
patientRouter.get("/:id",getSinglePatient)
patientRouter.put("/:id",updatePatient)
export default patientRouter