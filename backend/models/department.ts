import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
}

const DepartmentSchema = new Schema({
  name: String,
});

DepartmentSchema.index({name:1})
export default mongoose.model<IDepartment>(
  "Department",
  DepartmentSchema
);