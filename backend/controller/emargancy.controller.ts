import { Request, Response } from 'express'
import emaragansyModel from '../models/emaragansy.model'

export const createEmaragancyEntry = async (req: Request, res: Response) => {
    try {
        const emargancy = await emaragansyModel.create(
            req.body
        )

        return res.status(200).json({ message: "createEmaragancyEntry sucessfully", emargancy })
    } catch (error) {
        console.log("createEmaragancyEntry error", error)
        return res.status(500).json({ message: "createEmaragancyEntry error", error })
    }
}

export const getEmergencyList = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { status, severity, assignedDoctor } = req.query;

        const filter: any = {};
        if (status) filter.status = status;
        if (severity) filter.severity = severity;
        if (assignedDoctor) filter.assignedDoctor = assignedDoctor;

        const emergencies = await emaragansyModel.find(filter)
            .populate("patientId")
            .populate("assignedDoctor")
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await emaragansyModel.countDocuments(filter);

        return res.status(200).json({
            message: "getting emergency list successfully",
            emergencies,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log("getEmergencyList error", error);
        return res.status(500).json({ message: "getEmergencyList error", error });
    }
};

export const getSingleEmergency = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const emergency = await emaragansyModel.findById(id)
            .populate("patientId")
            .populate("assignedDoctor");

        if (!emergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }

        return res.status(200).json({ message: "getting single emergency successfully", emergency });
    } catch (error) {
        console.log("getSingleEmergency error", error);
        return res.status(500).json({ message: "getSingleEmergency error", error });
    }
};

export const updateEmergency = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedEmergency = await emaragansyModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEmergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }

        return res.status(200).json({ message: "emergency updated successfully", emergency: updatedEmergency });
    } catch (error) {
        console.log("updateEmergency error", error);
        return res.status(500).json({ message: "updateEmergency error", error });
    }
};

export const deleteEmergency = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedEmergency = await emaragansyModel.findByIdAndDelete(id);

        if (!deletedEmergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }

        return res.status(200).json({ message: "emergency entry deleted successfully", emergency: deletedEmergency });
    } catch (error) {
        console.log("deleteEmergency error", error);
        return res.status(500).json({ message: "deleteEmergency error", error });
    }
};

export const getEmergencyStats = async (req: Request, res: Response) => {
    try {
        const stats = await emaragansyModel.aggregate([
            {
                $facet: {
                    total: [
                        { $count: "count" }
                    ],
                    bySeverity: [
                        { $group: { _id: "$severity", count: { $sum: 1 } } }
                    ],
                    byStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    unassigned: [
                        {
                            $match: {
                                $or: [
                                    { assignedDoctor: { $exists: false } },
                                    { assignedDoctor: null }
                                ]
                            }
                        },
                        { $count: "count" }
                    ],
                    active: [
                        { $match: { status: { $in: ["WAITING", "IN_TREATMENT"] } } },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const result = stats[0] || {};
        const formattedStats = {
            total: result.total?.[0]?.count || 0,
            bySeverity: result.bySeverity || [],
            byStatus: result.byStatus || [],
            unassigned: result.unassigned?.[0]?.count || 0,
            active: result.active?.[0]?.count || 0
        };

        return res.status(200).json({
            message: "getting emergency stats successfully",
            stats: formattedStats
        });
    } catch (error) {
        console.log("getEmergencyStats error", error);
        return res.status(500).json({ message: "getEmergencyStats error", error });
    }
};

