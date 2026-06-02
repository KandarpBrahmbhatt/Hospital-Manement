import express from "express"
import billRouter from "./routes/biil.routes"
import connectdb from "./config/db"
import doctorRouter from "./routes/doctor.routes"
import departmentRouter from "./routes/department.routes"
import patientRouter from "./routes/Patient.rotues"
import activityRouter from "./routes/activity.routes"
import emargancyRouter from "./routes/emargancy.routes"

const app = express()

app.use(express.json())
app.use("/api",billRouter)
app.use("/api",doctorRouter)
app.use("/api",departmentRouter)
app.use("/api/patient",patientRouter)
app.use("/api/activity",activityRouter)
app.use("/api/emargancy",emargancyRouter)
const port = 5000
app.listen(port,()=>{
    console.log("server started",port)
    connectdb()
})