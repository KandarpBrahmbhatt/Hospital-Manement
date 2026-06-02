import express from 'express'
import { createPatientActivity, patientTimeline } from '../controller/activity.controller'

const activityRouter  = express.Router()

activityRouter.post("/createActivity",createPatientActivity)
activityRouter.get("/:patientId",patientTimeline);
export default activityRouter