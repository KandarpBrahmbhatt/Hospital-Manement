import { Request, Response } from "express";
import Token from "../models/token.model";

// Create Token
export const createToken = async (req: Request,res: Response): Promise<void> => {
    try {
        const { patientId, doctorId, priority = 0 } = req.body;

        const lastToken = await Token.findOne({doctorId,}).sort({ tokenNumber: -1 });

        const tokenNumber = lastToken? lastToken.tokenNumber + 1: 1;

        const token = await Token.create({
            patientId,
            doctorId,
            tokenNumber,
            priority,
            status: "WAITING",
        });

        res.status(201).json({
            success: true,
            message: "Token created successfully",
            data: token,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


 // Get Queue By Doctor

export const getQueueByDoctor = async (req: Request,res: Response): Promise<void> => {
    try {
        const { doctorId } = req.params;

        const queue = await Token.find({
            doctorId,
            status: {
            $in: ["WAITING", "CALLED", "IN_PROGRESS"],
            },
        })
            .populate("patientId")
            .sort({
                priority: -1,
                tokenNumber: 1,
            });

        res.status(200).json({
            success: true,
            count: queue.length,
            data: queue,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


 // Call Next Patient

export const callNextPatient = async (req: Request,res: Response): Promise<void> => {
    try {
        const { doctorId } = req.params;

        await Token.updateMany(
            {
                doctorId,
                status: "CALLED",
            },
            {
                status: "WAITING",
            }
        );

        const nextPatient = await Token.findOne({
            doctorId,
            status: "WAITING",
        }).sort({
            priority: -1,
            tokenNumber: 1,
        });

        if (!nextPatient) {
            res.status(404).json({
                success: false,
                message: "No patients in queue",
            });
            return;
        }

        nextPatient.status = "CALLED";
        await nextPatient.save();

        res.status(200).json({
            success: true,
            message: "Next patient called",
            data: nextPatient,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Start Consultation

export const startConsultation = async (req: Request,res: Response): Promise<void> => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findByIdAndUpdate(
            tokenId,
            {
                status: "IN_PROGRESS",
            },
            { new: true }
        );

        if (!token) {
            res.status(404).json({
                success: false,
                message: "Token not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Consultation started",
            data: token,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Complete Consultation

export const completeConsultation = async (req: Request,res: Response): Promise<void> => {
    try {
        const { tokenId } = req.params;

        const token = await Token.findByIdAndUpdate(
            tokenId,
            {
                status: "COMPLETED",
            },
            { new: true }
        );

        if (!token) {
            res.status(404).json({
                success: false,
                message: "Token not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Consultation completed",
            data: token,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Dashboard Analytics

export const tokenDashboard = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await Token.aggregate([
            {
                $facet: {
                    totalTokens: [
                        {
                            $count: "count",
                        },
                    ],
                    waiting: [
                        {
                            $match: {
                                status: "WAITING",
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                    completed: [
                        {
                            $match: {
                                status: "COMPLETED",
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                    inProgress: [
                        {
                            $match: {
                                status: "IN_PROGRESS",
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: result[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};