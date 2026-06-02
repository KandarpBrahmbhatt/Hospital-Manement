import {Request,Response} from 'express'
import Department from '../models/department'

export const departmentListing = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Department.aggregate([
      {
        $lookup: {
          from: "doctors", //secondCollection
          localField: "_id", //fieldfromcurrentcollection
          foreignField: "departmentId", //field from second collection
          as: "doctors",
        },
      },
      {
        $project: {
          name: 1,
          totalDoctors: {
            $size: "$doctors",
          },
        },
      },
      {
        $sort: {
          totalDoctors: -1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};