"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardAnalytics = exports.updatePatient = exports.getSinglePatient = exports.getPatientList = exports.createPatient = void 0;
const patient_1 = __importDefault(require("../models/patient"));
const bill_1 = __importDefault(require("../models/bill"));
const redis_1 = __importDefault(require("../config/redis"));
const AES_1 = require("../utiles/AES");
const createPatient = async (req, res) => {
    try {
        const { name, age, gender, aadhaarNumber, emergencyContact } = req.body;
        console.log(req.body);
        if (!name || !age || !gender) {
            return res.status(400).json({ message: "all field are required" });
        }
        //  const encrypted = encryptData(data);
        const newpatient = await patient_1.default.create({
            name,
            age,
            gender,
            aadhaarNumber: (0, AES_1.encryptData)(aadhaarNumber),
            emergencyContact: (0, AES_1.encryptData)(emergencyContact),
        });
        return res.status(200).json({ message: "patient created sucessfully", newpatient });
    }
    catch (error) {
        console.log("createPatenet error", error);
    }
};
exports.createPatient = createPatient;
const getPatientList = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const patent = await patient_1.default.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const cacheKey = `getPatientList:${page}:${limit}`;
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            console.log("Redis HIT");
            return res.status(200).json({ message: "cached sucessfully", source: "redis", ...JSON.parse(cached) });
        }
        console.log("cached Miss");
        const total = await patient_1.default.countDocuments();
        const result = {
            patent,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
        await redis_1.default.set(cacheKey, JSON.stringify(result), "EX", 60);
        return res.status(200).json({ message: "getting patient sucessfully", source: "database", ...result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "gettingPatient error", error });
    }
};
exports.getPatientList = getPatientList;
const getSinglePatient = async (req, res) => {
    const patient = await patient_1.default.findById(req.params.id);
    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }
    const response = {
        ...patient.toObject(),
        aadhaarNumber: (0, AES_1.decryptData)(patient.aadhaarNumber),
        emergencyContact: (0, AES_1.decryptData)(patient.emergencyContact)
    };
    return res.json(response);
};
exports.getSinglePatient = getSinglePatient;
const updatePatient = async (req, res) => {
    try {
        const patient = await patient_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: "updatePatien succesffully", success: true, data: patient });
    }
    catch (error) {
        console.log("updatePatient error", error);
        return res.status(500).json({ message: "updatePatien error", success: false, error });
    }
};
exports.updatePatient = updatePatient;
const dashboardAnalytics = async (req, res) => {
    try {
        // Aggregation Pipeline Starts
        const analytics = await bill_1.default.aggregate([
            // $facet allows multiple aggregations
            // to run in parallel in a single query.
            {
                $facet: {
                    // TOTAL REVENUE
                    totalRevenue: [
                        // Group all documents together
                        {
                            $group: {
                                _id: null,
                                // Sum all bill amounts
                                revenue: {
                                    $sum: "$totalAmount"
                                }
                            }
                        }
                    ],
                    // TOTAL BILLS COUNT
                    totalBills: [
                        // Count total bill documents
                        {
                            $count: "count"
                        }
                    ],
                    // AVERAGE BILL AMOUNT
                    averageBill: [
                        {
                            $group: {
                                _id: null,
                                // Calculate average bill amount
                                avgBill: {
                                    $avg: "$totalAmount"
                                }
                            }
                        }
                    ],
                    // HIGHEST BILL
                    highestBill: [
                        // Sort bills descending
                        {
                            $sort: {
                                totalAmount: -1
                            }
                        },
                        // Take top bill
                        {
                            $limit: 1
                        }
                    ],
                    // PAYMENT METHOD ANALYTICS
                    paymentMethods: [
                        {
                            $group: {
                                // Group by payment method
                                // CASH / CARD / UPI
                                _id: "$paymentMethod",
                                // Count documents
                                count: {
                                    $sum: 1
                                }
                            }
                        },
                        // Highest used payment method first
                        {
                            $sort: {
                                count: -1
                            }
                        }
                    ],
                    // MONTHLY REVENUE TREND
                    monthlyRevenue: [
                        {
                            $group: {
                                // Extract month from createdAt
                                _id: {
                                    month: {
                                        $month: "$createdAt"
                                    }
                                },
                                // Sum monthly revenue
                                revenue: {
                                    $sum: "$totalAmount"
                                }
                            }
                        },
                        // Sort January → December
                        {
                            $sort: {
                                "_id.month": 1
                            }
                        }
                    ]
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: analytics[0]
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error
        });
    }
};
exports.dashboardAnalytics = dashboardAnalytics;
