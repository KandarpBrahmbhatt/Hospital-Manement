import mongoose, { Schema } from "mongoose";

export interface INotification extends Document{
    userId:mongoose.Types.ObjectId,
    title:string,
    message:string,
    notificationtype:"EMAIL" | "SMS" | "STSTEM",
    isRead:boolean,
    created:Date,
    updatedAt:Date
}

const notificationSchema = new Schema<INotification>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        title:{
            type:String
        },
        message:{
            type:String
        },
        notificationtype:{
            type:String,
            enum:["EMAIL","SMS","SYSTEM"]
        },
        isRead:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true
    }
)

const Notification = mongoose.model<INotification>("Notification",notificationSchema)

export default Notification

