import express from 'express'
import {
  createAppoiment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  appointmentHistory
} from '../controller/Appoiment'

const appoimentRouter = express.Router()

appoimentRouter.post("/create", createAppoiment)
appoimentRouter.get("/", getAppointments)
appoimentRouter.put("/cancel/:id", cancelAppointment)
appoimentRouter.put("/reschedule/:id", rescheduleAppointment)
appoimentRouter.get("/history/:patientId", appointmentHistory)

export default appoimentRouter