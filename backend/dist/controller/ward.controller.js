"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wardDashboard = exports.deleteWard = exports.updateWard = exports.getAllWard = exports.createWard = void 0;
const ward_model_1 = __importDefault(require("../models/ward.model"));
const createWard = async (req, res) => {
    try {
        const { wardName, wardType, totalBeds } = req.body;
        console.log(req.body);
        if (!wardName || !wardType || !totalBeds) {
            return res.status(400).json({ message: "all field are required" });
        }
        const ward = await ward_model_1.default.create({
            wardName,
            wardType,
            totalBeds
        });
        return res.status(201).json({ message: "ward created sucessfully", ward });
    }
    catch (error) {
        console.log("createWard error", error);
        return res.status(500).json({ message: "ward created error", error });
    }
};
exports.createWard = createWard;
const getAllWard = async (req, res) => {
    try {
        const ward = await ward_model_1.default.find();
        return res.status(200).json({ message: "getAllWard sucessfully", ward });
    }
    catch (error) {
        console.log("getAllWard error", error);
        return res.status(500).json({ message: "getAllWard error", error });
    }
};
exports.getAllWard = getAllWard;
const updateWard = async (req, res) => {
    try {
        const ward = await ward_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ward) {
            return res.status(400).json({ message: "ward not found" });
        }
        return res.status(200).json({ message: "updateward successfully", ward });
    }
    catch (error) {
        console.log("updateWord error");
        return res.status(200).json({ message: "updateward errro", error });
    }
};
exports.updateWard = updateWard;
const deleteWard = async (req, res) => {
    try {
        const ward = await ward_model_1.default.findById(req.params.id);
        if (!ward) {
            return res.status(400).json({ message: "ward not found" });
        }
        await ward_model_1.default.findByIdAndDelete(ward);
        return res.status(200).json({ message: "word deleted sucessfully", ward });
    }
    catch (error) {
        console.log("deleteWard error", error);
        return res.status(500).json({ message: "word deleted error", error });
    }
};
exports.deleteWard = deleteWard;
const wardDashboard = async (req, res) => {
    try {
        const stats = await ward_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalWards: { $sum: 1 },
                    totalBeds: { $sum: "$totalBeds" },
                    icuWard: {
                        $sum: {
                            $cond: [
                                { $eq: ["$wardType", "ICU"] },
                                1,
                                0
                            ]
                        }
                    },
                    privateWard: {
                        $sum: {
                            $cond: [
                                { $eq: ["$wardType", "Private"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        return res.status(200).json(stats[0]);
    }
    catch (error) {
        console.log("wardDashboard error", error);
        return res.status(500).json({
            message: "wardDashboard error",
            error
        });
    }
};
exports.wardDashboard = wardDashboard;
