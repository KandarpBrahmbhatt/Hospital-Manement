"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_aggregate_1 = require("../controller/doctor.aggregate");
const doctorRouter = express_1.default.Router();
doctorRouter.get("/doctor", doctor_aggregate_1.doctorListing);
doctorRouter.get("/appointmentListing", doctor_aggregate_1.appointmentListing);
doctorRouter.get("/patientListing", doctor_aggregate_1.patientListing);
exports.default = doctorRouter;
