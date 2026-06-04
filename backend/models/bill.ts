import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  amount: number;
  pdfUrl?: string;
  createdAt: Date;
}

const BillSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    amount: Number,
    pdfUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);



BillSchema.index({ patientId: 1 })
BillSchema.index({ doctorId: 1 })
export default mongoose.model<IBill>(
  "Bill",
  BillSchema
);