import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        tokenNumber: {
            type: Number,
            required: true,
        },

        priority: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "WAITING",
                "CALLED",
                "IN_PROGRESS",
                "COMPLETED",
            ],
            default: "WAITING",
        },
    },
    {
        timestamps: true,
    }
);

TokenSchema.index({
    doctorId: 1,
    status: 1,
});

TokenSchema.index({
    doctorId: 1,
    tokenNumber: 1,
});

TokenSchema.index({
    priority: -1,
});

export default mongoose.model(
    "Token",
    TokenSchema
);