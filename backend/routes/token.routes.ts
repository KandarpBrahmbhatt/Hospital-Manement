import express from 'express'
import { callNextPatient, completeConsultation, createToken, getQueueByDoctor, startConsultation, tokenDashboard } from '../controller/token.controller'
import { apiLimiter } from '../middaleware/rateLimit.middleware';

const tokenRouter = express.Router()

tokenRouter.post("/create",createToken)
tokenRouter.get("/queue/:doctorId",apiLimiter, getQueueByDoctor);
tokenRouter.put("/next/:doctorId", callNextPatient);
tokenRouter.put("/start/:tokenId", startConsultation);
tokenRouter.put("/complete/:tokenId", completeConsultation);
tokenRouter.get("/dashboard",apiLimiter, tokenDashboard);

export default tokenRouter
