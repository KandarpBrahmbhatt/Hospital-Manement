import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      unique: true
    },

    activities: [
      {
        activityType: {
          type: String,
          enum: [
            "PATIENT_CREATED",
            "APPOINTMENT_BOOKED",
            "APPOINTMENT_CANCELLED",
            "DOCTOR_VISITED",
            "BILL_CREATED"
          ]
        },

        description: String,

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

activitySchema.index({ patientId: 1 });

export default mongoose.model("Activity", activitySchema);