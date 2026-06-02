import activityModel from "../models/activity.model"
import { Request, Response } from "express"

export const createPatientActivity = async (req:Request, res:Response) => {
  try {
    const { patientId, activityType, description } = req.body;

    //one doucment and all activity store in array
    const activity = await activityModel.findOneAndUpdate(
      { patientId },

      {
        $push: {
          activities: {
            activityType,
            description
          }
        }
      },

      {
        new: true,
        upsert: true
      }
    );

    return res.json({
      success: true,
      message: "Activity added successfully",
      data: activity
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error creating activity"
    });
  }
};

export const patientTimeline = async (req: Request, res: Response) => {

    try {
        const timeline = await activityModel.find({
            patientId: req.params.patientId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "patientTimeline getting sucessfully",
            success: true,
            data: timeline
        });
    } catch (error) {
        console.log("patientTimeLine getting error", error)
    }
};