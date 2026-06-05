import mongoose, { Schema } from "mongoose";

export interface IBed extends Document{
    wardId:mongoose.Types.ObjectId,
    bedNumber:string,
    status:string,
    patiendId?:mongoose.Types.ObjectId
}

const BedSchema = new Schema({
    wardId:{
        type:Schema.Types.ObjectId,
        ref:"Ward"
    },
    bedNumber:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Available","Occupied"],
        default:"Available"
    },
    patiendId:{
        type:Schema.Types.ObjectId,
        ref:"Patient",
        default:null
    }
})

export default mongoose.model<IBed>("Bed",BedSchema)