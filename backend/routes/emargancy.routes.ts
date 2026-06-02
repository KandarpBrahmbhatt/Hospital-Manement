import express from 'express'
import {
    createEmaragancyEntry,
    getEmergencyList,
    getSingleEmergency,
    updateEmergency,
    deleteEmergency,
    getEmergencyStats
} from '../controller/emargancy.controller'

const emargancyRouter = express.Router()

emargancyRouter.post("/create", createEmaragancyEntry)
emargancyRouter.get("/list", getEmergencyList)
emargancyRouter.get("/stats", getEmergencyStats)
emargancyRouter.get("/:id", getSingleEmergency)
emargancyRouter.put("/:id", updateEmergency)
emargancyRouter.delete("/:id", deleteEmergency)

export default emargancyRouter