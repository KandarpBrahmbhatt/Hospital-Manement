import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
}

const PatientSchema = new Schema({
  name: String,
  age: Number,
  gender: String,

  email: String,
  phone: String,

  insurance: {
    hasInsurance: { type: Boolean, default: false },
    providerName: String,
    policyNumber: String,
    coverageLimit: Number,
    validTill: Date
  }
});
PatientSchema.index({ email: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ name: 1 });

export default mongoose.model<IPatient>(
  "Patient",
  PatientSchema
);