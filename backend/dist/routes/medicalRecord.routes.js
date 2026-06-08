"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalRecord_controller_1 = require("../controller/medicalRecord.controller");
const medicalRecordRouter = express_1.default.Router();
medicalRecordRouter.post("/create", medicalRecord_controller_1.createMedicalRecord);
medicalRecordRouter.get("/patient/:patientId", medicalRecord_controller_1.getPatientHistory);
medicalRecordRouter.get("/:id", medicalRecord_controller_1.getMedicalRecordById);
medicalRecordRouter.put("/:id", medicalRecord_controller_1.updateMedicalRecord);
medicalRecordRouter.delete("/:id", medicalRecord_controller_1.deletedMedicalRecord);
// medicalRecordRouter.post( "/upload/:id", uploadLabReport);
medicalRecordRouter.get("/dashboard/stats", medicalRecord_controller_1.medicalDashboard);
// medicalRecordRouter.get("/generateMedicalRecordPdf/:id",generateMedicalRecordPdf)
medicalRecordRouter.get("/downloadAndEmailMedicalPdf/:id", medicalRecord_controller_1.downloadAndEmailMedicalPdf);
exports.default = medicalRecordRouter;
