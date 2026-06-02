import express from 'express'
import { departmentListing } from '../controller/deparment.aggregate'

const departmentRouter  = express.Router()

departmentRouter.get("/department",departmentListing)

export default departmentRouter