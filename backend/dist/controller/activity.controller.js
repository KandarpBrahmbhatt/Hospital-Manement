"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientTimeline = exports.createPatientActivity = void 0;
const activity_model_1 = __importDefault(require("../models/activity.model"));
const createPatientActivity = async (req, res) => {
    try {
        const { patientId, activityType, description } = req.body;
        //one doucment and all activity store in array
        const activity = await activity_model_1.default.findOneAndUpdate({ patientId }, {
            $push: {
                activities: {
                    activityType,
                    description
                }
            }
        }, {
            new: true,
            upsert: true
        });
        return res.json({
            success: true,
            message: "Activity added successfully",
            data: activity
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating activity"
        });
    }
};
exports.createPatientActivity = createPatientActivity;
const patientTimeline = async (req, res) => {
    try {
        const timeline = await activity_model_1.default.find({
            patientId: req.params.patientId
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: "patientTimeline getting sucessfully",
            success: true,
            data: timeline
        });
    }
    catch (error) {
        console.log("patientTimeLine getting error", error);
    }
};
exports.patientTimeline = patientTimeline;
