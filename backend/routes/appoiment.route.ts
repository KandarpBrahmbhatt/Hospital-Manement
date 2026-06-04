import express from 'express'
import { createAppoiment } from '../controller/Appoiment'

const appoimentRouter = express.Router()

appoimentRouter.post("/create",createAppoiment)

export default appoimentRouter