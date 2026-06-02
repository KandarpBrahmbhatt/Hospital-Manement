import mongoose, { Schema } from "mongoose";

const InsuranceSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    providerName: String,   // Star Health, LIC, etc
    policyNumber: String,

    coverageLimit: Number,  // total amount covered
    usedAmount: {
      type: Number,
      default: 0
    },

    validFrom: Date,
    validTill: Date,

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "SUSPENDED"],
      default: "ACTIVE"
    },

    cardNumber: String
  },
  { timestamps: true }
);

export default mongoose.model("Insurance", InsuranceSchema);