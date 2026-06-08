"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentListing = void 0;
const department_1 = __importDefault(require("../models/department"));
const departmentListing = async (req, res) => {
    try {
        const result = await department_1.default.aggregate([
            {
                $lookup: {
                    from: "doctors", //secondCollection
                    localField: "_id", //fieldfromcurrentcollection
                    foreignField: "departmentId", //field from second collection
                    as: "doctors",
                },
            },
            {
                $project: {
                    name: 1,
                    totalDoctors: {
                        $size: "$doctors",
                    },
                },
            },
            {
                $sort: {
                    totalDoctors: -1,
                },
            },
        ]);
        res.json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.departmentListing = departmentListing;
