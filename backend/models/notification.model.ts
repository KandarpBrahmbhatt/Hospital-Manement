import mongoose, { Schema } from "mongoose";

// INotification interface with comments and fix for typescript typo:
// Change 1: Made userId optional (?) to allow system-wide/broadcast notifications.
// Change 2: Changed notificationtype typo 'STSTEM' -> 'SYSTEM'.
export interface INotification extends Document {
    userId?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    notificationtype?: "EMAIL" | "SMS" | "SYSTEM";
    isRead: boolean;
    created: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        // Change 3: Made userId optional by removing required: true so that general notifications don't fail schema validation.
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        title: {
            type: String
        },
        message: {
            type: String
        },
        notificationtype: {
            type: String,
            enum: ["EMAIL", "SMS", "SYSTEM"]
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;

