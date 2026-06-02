import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  departmentId: mongoose.Types.ObjectId;
  consultationFee: number;
}

const DoctorSchema = new Schema({
  name: String,
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
  },
  consultationFee: Number,
});


DoctorSchema.index({departmentId:1}),
DoctorSchema.index({name:1})

export default mongoose.model<IDoctor>(
  "Doctor",
  DoctorSchema
);