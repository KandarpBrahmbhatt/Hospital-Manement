import { Request, Response } from "express"
import Patient from "../models/patient"

export const createPatient = async (req: Request, res: Response) => {
    try {
        const { name, age, gender } = req.body
        console.log(req.body)

        if (!name || !age || !gender) {
            return res.status(400).json({ message: "all field are required" })
        }

        const newpatient = await Patient.create({
            name,
            age,
            gender
        })

        return res.status(200).json({ message: "patient created sucessfully", newpatient })
    } catch (error) {
        console.log("createPatenet error", error)
    }
}


export const getPatientList = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const patent = await Patient.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Patient.countDocuments();
        return res.status(200).json({
            message: "getting patient sucessfully",
            patent,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "gettingPatient error", error })
    }
}

export const getSinglePatient = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id)

        return res.status(200).json({ message: "gettingsinglePatient successfully", patient })

    } catch (error) {
        console.log("gettingSinglePatient error", error)
        return res.status(500).json({ message: "getting singlePatient error", error })
    }
}

export const updatePatient = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(200).json({ message: "updatePatien succesffully", success: true, data: patient });
    } catch (error) {
        console.log("updatePatient error", error)
        return res.status(500).json({ message: "updatePatien error", success: false, error });
    }
};

