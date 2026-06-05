import mongoose, { Document, Schema } from "mongoose";

interface IPrescription {
  medicine: string;
  dosage: string;
  duration: string;
}

interface ILabReport {
  fileUrl: string;
  uploadedAt: Date;
}

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  diagnosis: string;
  symptoms: string[];
  prescription: IPrescription[];
  allergies: string[];
  treatmentNotes?: string;
  doctorRemarks?: string;
  labReports: ILabReport[];
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
    },

    symptoms: [
      {
        type: String,
      },
    ],

    prescription: [
      {
        medicine: {
          type: String,
        },
        dosage: {
          type: String,
        },
        duration: {
          type: String,
        },
      },
    ],

    allergies: [
      {
        type: String,
      },
    ],

    treatmentNotes: {
      type: String,
    },

    doctorRemarks: {
      type: String,
    },

    labReports: [
      {
        fileUrl: {
          type: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model<IMedicalRecord>(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;