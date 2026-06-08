"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDashboard = exports.completeConsultation = exports.startConsultation = exports.callNextPatient = exports.getQueueByDoctor = exports.createToken = void 0;
const token_model_1 = __importDefault(require("../models/token.model"));
// Create Token
const createToken = async (req, res) => {
    try {
        const { patientId, doctorId, priority = 0 } = req.body;
        const lastToken = await token_model_1.default.findOne({ doctorId, }).sort({ tokenNumber: -1 });
        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
        const token = await token_model_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createToken = createToken;
// Get Queue By Doctor
const getQueueByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const queue = await token_model_1.default.find({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getQueueByDoctor = getQueueByDoctor;
// Call Next Patient
const callNextPatient = async (req, res) => {
    try {
        const { doctorId } = req.params;
        await token_model_1.default.updateMany({
            doctorId,
            status: "CALLED",
        }, {
            status: "WAITING",
        });
        const nextPatient = await token_model_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.callNextPatient = callNextPatient;
// Start Consultation
const startConsultation = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const token = await token_model_1.default.findByIdAndUpdate(tokenId, {
            status: "IN_PROGRESS",
        }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.startConsultation = startConsultation;
// Complete Consultation
const completeConsultation = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const token = await token_model_1.default.findByIdAndUpdate(tokenId, {
            status: "COMPLETED",
        }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.completeConsultation = completeConsultation;
// Dashboard Analytics
const tokenDashboard = async (req, res) => {
    try {
        const result = await token_model_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.tokenDashboard = tokenDashboard;
