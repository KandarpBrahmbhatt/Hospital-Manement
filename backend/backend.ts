import express from "express"
import billRouter from "./routes/biil.routes"
import connectdb from "./config/db"
import doctorRouter from "./routes/doctor.routes"
import departmentRouter from "./routes/department.routes"
import patientRouter from "./routes/Patient.rotues"
import activityRouter from "./routes/activity.routes"
import emargancyRouter from "./routes/emargancy.routes"
import tokenRouter from "./routes/token.routes"
import authRouter from "./routes/auth.routes"
import cookieParser from "cookie-parser";
import cors from 'cors'
import appoimentRouter from "./routes/appoiment.route"
import { startAppointmentReminderJob } from "./cron/AppoimentReminder.cron"
const app = express()

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}))
app.use("/api",billRouter)
app.use("/api",doctorRouter)
app.use("/api",departmentRouter)
app.use("/api/patient",patientRouter)
app.use("/api/activity",activityRouter)
app.use("/api/emargancy",emargancyRouter)
app.use("/api/token",tokenRouter)
app.use("/api/auth",authRouter)
app.use("/api/appoiment",appoimentRouter)

const port = 4000
app.listen(port, async ()=>{
    console.log("server started",port)
    await connectdb()
    await startAppointmentReminderJob()
})
