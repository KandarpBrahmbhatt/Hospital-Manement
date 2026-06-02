import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  status: string;
}

const AppointmentSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  appointmentDate: Date,
  status: {
    type: String,
    enum: ["Completed", "Pending", "Cancelled"],
  },
});

AppointmentSchema.index({patientId:1})
AppointmentSchema.index({doctorId:1})
AppointmentSchema.index({appointmentDate:1})
export default mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);