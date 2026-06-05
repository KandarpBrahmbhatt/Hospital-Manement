import { Request,Response } from "express"
import bedModel from "../models/bed.model"

export const createBed = async(req:Request,res:Response)=>{
    try {
        const {wardId,bedNumber,status,patiendId} = req.body
        console.log(req.body)

        if (!wardId || !bedNumber || !status ||!patiendId) {
            return res.status(400).json({message:"all field are required"})
        }

        const ward = await bedModel.create({
            wardId,
            bedNumber,
            status,
            patiendId
        })

        return res.status(201).json({message:"ward created sucessfully",ward})
    } catch (error) {
        console.log("createWard error",error)
        return res.status(500).json({message:"ward created error",error})
    }
}