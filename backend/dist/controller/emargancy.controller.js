"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmergencyStats = exports.deleteEmergency = exports.updateEmergency = exports.getSingleEmergency = exports.getEmergencyList = exports.createEmaragancyEntry = void 0;
const emaragansy_model_1 = __importDefault(require("../models/emaragansy.model"));
const patient_1 = __importDefault(require("../models/patient"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
// Prevent tree-shaking of model registrations
const _models = { Patient: patient_1.default, Doctor: Doctor_1.default };
const createEmaragancyEntry = async (req, res) => {
    try {
        const emargancy = await emaragansy_model_1.default.create(req.body);
        return res.status(200).json({ message: "createEmaragancyEntry sucessfully", emargancy });
    }
    catch (error) {
        console.log("createEmaragancyEntry error", error);
        return res.status(500).json({ message: "createEmaragancyEntry error", error });
    }
};
exports.createEmaragancyEntry = createEmaragancyEntry;
const getEmergencyList = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { status, severity, assignedDoctor } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (severity)
            filter.severity = severity;
        if (assignedDoctor)
            filter.assignedDoctor = assignedDoctor;
        const emergencies = await emaragansy_model_1.default.find(filter)
            .populate("patientId")
            .populate("assignedDoctor")
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await emaragansy_model_1.default.countDocuments(filter);
        return res.status(200).json({
            message: "getting emergency list successfully",
            emergencies,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.log("getEmergencyList error", error);
        return res.status(500).json({ message: "getEmergencyList error", error });
    }
};
exports.getEmergencyList = getEmergencyList;
const getSingleEmergency = async (req, res) => {
    try {
        const { id } = req.params;
        const emergency = await emaragansy_model_1.default.findById(id)
            .populate("patientId")
            .populate("assignedDoctor");
        if (!emergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }
        return res.status(200).json({ message: "getting single emergency successfully", emergency });
    }
    catch (error) {
        console.log("getSingleEmergency error", error);
        return res.status(500).json({ message: "getSingleEmergency error", error });
    }
};
exports.getSingleEmergency = getSingleEmergency;
const updateEmergency = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmergency = await emaragansy_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEmergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }
        return res.status(200).json({ message: "emergency updated successfully", emergency: updatedEmergency });
    }
    catch (error) {
        console.log("updateEmergency error", error);
        return res.status(500).json({ message: "updateEmergency error", error });
    }
};
exports.updateEmergency = updateEmergency;
const deleteEmergency = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmergency = await emaragansy_model_1.default.findByIdAndDelete(id);
        if (!deletedEmergency) {
            return res.status(404).json({ message: "Emergency entry not found" });
        }
        return res.status(200).json({ message: "emergency entry deleted successfully", emergency: deletedEmergency });
    }
    catch (error) {
        console.log("deleteEmergency error", error);
        return res.status(500).json({ message: "deleteEmergency error", error });
    }
};
exports.deleteEmergency = deleteEmergency;
const getEmergencyStats = async (req, res) => {
    try {
        const stats = await emaragansy_model_1.default.aggregate([
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
    }
    catch (error) {
        console.log("getEmergencyStats error", error);
        return res.status(500).json({ message: "getEmergencyStats error", error });
    }
};
exports.getEmergencyStats = getEmergencyStats;
