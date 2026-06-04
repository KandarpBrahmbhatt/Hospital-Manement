import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  status: string;
  reminderSent: boolean;
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
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Cancelled"],
    default: "Pending",
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
});

AppointmentSchema.index({ patientId: 1 })
AppointmentSchema.index({ doctorId: 1 })
AppointmentSchema.index({ appointmentDate: 1 })
export default mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);
