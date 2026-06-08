"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientListing = exports.appointmentListing = exports.doctorListing = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const appoiment_model_1 = __importDefault(require("../models/appoiment.model"));
const doctorListing = async (req, res) => {
    try {
        const result = await appoiment_model_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.doctorListing = doctorListing;
//daily appoiment counting
const appointmentListing = async (req, res) => {
    try {
        const result = await appoiment_model_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.appointmentListing = appointmentListing;
const patientListing = async (req, res) => {
    try {
        const cacheKey = `getpatientListing`;
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            console.log("Cache Hit");
            return res.status(200).json({ source: "redis", ...JSON.parse(cached) });
        }
        console.log("Cache Miss");
        const result = await appoiment_model_1.default.aggregate([
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
        const total = await appoiment_model_1.default.countDocuments();
        const data = {
            result,
            total
        };
        await redis_1.default.set(cacheKey, JSON.stringify(data), "EX", "60");
        return res.status(200).json({ message: "getting patientListing sucessfully", ...data, source: "DataBase" });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.patientListing = patientListing;
