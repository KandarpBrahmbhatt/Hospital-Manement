"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBed = void 0;
const bed_model_1 = __importDefault(require("../models/bed.model"));
const createBed = async (req, res) => {
    try {
        const { wardId, bedNumber, status, patiendId } = req.body;
        console.log(req.body);
        if (!wardId || !bedNumber || !status || !patiendId) {
            return res.status(400).json({ message: "all field are required" });
        }
        const ward = await bed_model_1.default.create({
            wardId,
            bedNumber,
            status,
            patiendId
        });
        return res.status(201).json({ message: "ward created sucessfully", ward });
    }
    catch (error) {
        console.log("createWard error", error);
        return res.status(500).json({ message: "ward created error", error });
    }
};
exports.createBed = createBed;
