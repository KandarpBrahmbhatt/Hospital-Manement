import express from "express"
import { createWard, deleteWard, getAllWard, updateWard, wardDashboard } from "../controller/ward.controller"
import { apiLimiter } from "../middaleware/rateLimit.middleware"

const wardRouter = express.Router()

wardRouter.post("/create",createWard)
wardRouter.get("/get",apiLimiter,getAllWard)
wardRouter.put("/update/:id",apiLimiter,updateWard)
wardRouter.delete("/delete/:id",apiLimiter,deleteWard)
wardRouter.get("/wardDashboard",apiLimiter,wardDashboard)

export default wardRouter