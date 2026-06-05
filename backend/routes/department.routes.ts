import express from 'express'
import { departmentListing } from '../controller/deparment.aggregate'
import { apiLimiter } from '../middaleware/rateLimit.middleware'

const departmentRouter  = express.Router()

departmentRouter.get("/department",apiLimiter,departmentListing)

export default departmentRouter