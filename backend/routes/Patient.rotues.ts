import express from 'express'
import { billListing, dashboard } from '../controller/biil.aggregate'
import { createPatient, dashboardAnalytics, getPatientList, getSinglePatient, updatePatient } from '../controller/patitentCRUD'
import { authorize, isAuth } from '../middaleware/auth.middleware'

const patientRouter  = express.Router()

patientRouter.get("/agg",dashboardAnalytics)
patientRouter.post("/create",isAuth,authorize("patient:create"),createPatient)
patientRouter.get("/getPatientList", isAuth,authorize("patient:view"),getPatientList)
patientRouter.get("/:id",getSinglePatient)
patientRouter.put("/:id",updatePatient)
export default patientRouter