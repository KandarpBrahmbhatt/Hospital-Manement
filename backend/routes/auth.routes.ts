import express from "express"
import { login, signup, getRoles } from "../controller/auth.controller"

const authRouter  = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/roles", getRoles)

export default authRouter