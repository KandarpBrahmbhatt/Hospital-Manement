import mongoose, { Schema } from 'mongoose'

export interface IWard extends Document {
    wardName:string,
    wardType:string, // general,icu.privete
    totalBeds:number
}

const wardSchema = new Schema({
    wardName:{
        type:String,
        required:true
    },
    wardType:{
        type:String,
        enum:["General","Private","ICU"],
        required:true
    },
    totalBeds:{
        type:Number,
        required:true
    }
})

export default mongoose.model<IWard>("Ward",wardSchema)