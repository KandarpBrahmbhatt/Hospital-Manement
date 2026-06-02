import mongoose, { Schema } from "mongoose";

const EmergencySchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient"
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "HIGH"
    },

    status: {
      type: String,
      enum: ["WAITING", "IN_TREATMENT", "STABILIZED", "ADMITTED"],
      default: "WAITING"
    },

    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor"
    },

    reason: String
  },
  { timestamps: true }
);

export default mongoose.model("Emergency", EmergencySchema);