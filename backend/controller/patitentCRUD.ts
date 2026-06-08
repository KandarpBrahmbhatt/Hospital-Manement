import { Request, Response } from "express"
import Patient from "../models/patient"
import Bill from "../models/bill"
import redis from "../config/redis"
import { decryptData, encryptData } from '../utiles/AES'
export const createPatient = async (req: Request, res: Response) => {
    try {
        const { name, age, gender, aadhaarNumber, emergencyContact } = req.body
        console.log(req.body)

        if (!name || !age || !gender) {
            return res.status(400).json({ message: "all field are required" })
        }
        //  const encrypted = encryptData(data);
        const newpatient = await Patient.create({
            name,
            age,
            gender,
            aadhaarNumber: encryptData(aadhaarNumber),
            emergencyContact: encryptData(emergencyContact),
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

        const cacheKey = `getPatientList:${page}:${limit}`;

        const cached = await redis.get(cacheKey)
        if (cached) {
            console.log("Redis HIT")
            return res.status(200).json({ message: "cached sucessfully", source: "redis", ...JSON.parse(cached) })
        }
        console.log("cached Miss")
        const total = await Patient.countDocuments();

        const result = {
            patent,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }

        await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
        return res.status(200).json({ message: "getting patient sucessfully", source: "database", ...result });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "gettingPatient error", error })
    }
}


export const getSinglePatient = async (
    req: Request,
    res: Response
) => {

    const patient =
        await Patient.findById(req.params.id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const response = {
        ...patient.toObject(),

        aadhaarNumber: decryptData(
            patient.aadhaarNumber
        ),
        emergencyContact: decryptData(
            patient.emergencyContact
        )
    };

    return res.json(response);
};

export const updatePatient = async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(200).json({ message: "updatePatien succesffully", success: true, data: patient });
    } catch (error) {
        console.log("updatePatient error", error)
        return res.status(500).json({ message: "updatePatien error", success: false, error });
    }
};

export const dashboardAnalytics = async (
    req: Request,
    res: Response
) => {
    try {

        // Aggregation Pipeline Starts
        const analytics = await Bill.aggregate([

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

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error
        });

    }
};