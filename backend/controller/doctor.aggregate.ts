import redis from "../config/redis";
import appoiment from "../models/appoiment.model";
import { Request,Response } from "express";

export const doctorListing = async (req: Request,res: Response) => {
  try {
    const result = await appoiment.aggregate([
      {
        $group: {
          _id: "$doctorId",
          patientCount: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $project: {
          doctorName: "$doctor.name",
          specialization: "$doctor.specialization",
          patientCount: 1,
        },
      },
      {
        $sort: {
          patientCount: -1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};



//daily appoiment counting
export const appointmentListing = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await appoiment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$appointmentDate",
            },
          },
          totalAppointments: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const patientListing = async (req: Request,res: Response) => {
  try {
    const cacheKey= `getpatientListing`
    const cached = await redis.get(cacheKey)

    if (cached) {
        console.log("Cache Hit")
        return res.status(200).json({source:"redis",...JSON.parse(cached)})
    }
    console.log("Cache Miss")

    const result = await appoiment.aggregate([
      {
        $group: {
          _id: "$patientId",
          totalVisits: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $project: {
          patientName: "$patient.name",
          age: "$patient.age",
          totalVisits: 1,
        },
      },
      {
        $sort: {
          totalVisits: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

       const total = await appoiment.countDocuments()

    const data = {
        result,
        total
    }

    await redis.set(cacheKey,JSON.stringify(data),"EX","60")
    return res.status(200).json({message:"getting patientListing sucessfully",...data,source: "DataBase"})
  } catch (error) {
    res.status(500).json(error);
  }
};