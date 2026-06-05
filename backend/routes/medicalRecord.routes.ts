import express from "express";

import {
  createMedicalRecord,
  getPatientHistory,
  getMedicalRecordById,
  updateMedicalRecord,
  deletedMedicalRecord,
//   uploadLabReport,
  medicalDashboard,
//   generateMedicalRecordPdf,
  downloadAndEmailMedicalPdf,
} from "../controller/medicalRecord.controller"

const medicalRecordRouter = express.Router();

medicalRecordRouter.post("/create", createMedicalRecord);

medicalRecordRouter.get( "/patient/:patientId",getPatientHistory);

medicalRecordRouter.get("/:id", getMedicalRecordById);

medicalRecordRouter.put("/:id", updateMedicalRecord);

medicalRecordRouter.delete("/:id", deletedMedicalRecord);

// medicalRecordRouter.post( "/upload/:id", uploadLabReport);

medicalRecordRouter.get("/dashboard/stats", medicalDashboard);

// medicalRecordRouter.get("/generateMedicalRecordPdf/:id",generateMedicalRecordPdf)

medicalRecordRouter.get("/downloadAndEmailMedicalPdf/:id",downloadAndEmailMedicalPdf)
export default medicalRecordRouter;