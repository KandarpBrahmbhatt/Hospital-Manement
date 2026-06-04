import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

const uploadOnCloudinary  = async(filePath)=>{
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        cloud_api_key:process.env.CLOUDINARY_API_KEY,
        cloud_api_secret:process.env.CLOUDINARY_API_SECRET
    })

    try {
        if (!filePath) {
            return null
        }

        const uploadResult = await cloudinary.uploader.upload(filepath)
        return uploadResult.secure_url
    } catch (error) {
        console.log("uploadOnCloudinary error",error)
        fs.unlinkSync(filePath)
        console.log("error")
    }
}

export default uploadOnCloudinary