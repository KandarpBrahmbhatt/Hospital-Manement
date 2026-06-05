import Ward from "../models/ward.model"
import {Request,Response} from 'express'

export const createWard = async(req:Request,res:Response)=>{
    try {
        const {wardName,wardType,totalBeds} = req.body
        console.log(req.body)

        if (!wardName ||!wardType||!totalBeds) {
            return res.status(400).json({message:"all field are required"})
        }

        const ward = await Ward.create({
          wardName,
          wardType,
          totalBeds
        })

        return res.status(201).json({message:"ward created sucessfully",ward})
    } catch (error) {
        console.log("createWard error",error)
        return res.status(500).json({message:"ward created error",error})
    }
}

export const getAllWard = async(req:Request,res:Response)=>{
    try {
        const ward = await Ward.find()

        return res.status(200).json({message:"getAllWard sucessfully",ward})
    } catch (error) {
        console.log("getAllWard error",error)
        return res.status(500).json({message:"getAllWard error",error})
    }
}

export const updateWard = async(req:Request,res:Response)=>{
    try {
        const ward = await Ward.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if (!ward) {
            return res.status(400).json({message:"ward not found"})
        }

        return res.status(200).json({message:"updateward successfully",ward})
    } catch (error) {
        console.log("updateWord error")
        return res.status(200).json({message:"updateward errro",error})
    }
}

export const deleteWard = async(req:Request,res:Response)=>{
    try {
        const ward  = await Ward.findById(req.params.id)

        if (!ward) {
            return res.status(400).json({message:"ward not found"})
        }

        await Ward.findByIdAndDelete(ward)

        return res.status(200).json({message:"word deleted sucessfully",ward})

    } catch (error) {
        console.log("deleteWard error",error)
        return res.status(500).json({message:"word deleted error",error})
    }
}

export const wardDashboard = async (req: Request, res: Response) => {
  try {
    const stats = await Ward.aggregate([
      {
        $group: {
          _id: null,
          totalWards: { $sum: 1 },
          totalBeds: { $sum: "$totalBeds" },

          icuWard: {
            $sum: {
              $cond: [
                { $eq: ["$wardType", "ICU"] },
                1,
                0
              ]
            }
          },

          privateWard: {
            $sum: {
              $cond: [
                { $eq: ["$wardType", "Private"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    return res.status(200).json(stats[0]);

  } catch (error) {
    console.log("wardDashboard error", error);

    return res.status(500).json({
      message: "wardDashboard error",
      error
    });
  }
};