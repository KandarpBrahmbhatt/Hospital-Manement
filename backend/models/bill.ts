import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  amount: number;
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
  },
  { timestamps: true }
);



BillSchema.index({patientId:1})
BillSchema.index({doctorId:1})
export default mongoose.model<IBill>(
  "Bill",
  BillSchema
);