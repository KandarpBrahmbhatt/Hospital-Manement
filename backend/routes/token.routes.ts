import express from 'express'
import { callNextPatient, completeConsultation, createToken, getQueueByDoctor, startConsultation, tokenDashboard } from '../controller/token.controller'

const tokenRouter = express.Router()

tokenRouter.post("/create",createToken)
tokenRouter.get("/queue/:doctorId", getQueueByDoctor);
tokenRouter.put("/next/:doctorId", callNextPatient);
tokenRouter.put("/start/:tokenId", startConsultation);
tokenRouter.put("/complete/:tokenId", completeConsultation);
tokenRouter.get("/dashboard", tokenDashboard);

export default tokenRouter
