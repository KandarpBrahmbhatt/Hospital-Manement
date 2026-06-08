"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const uploadOnCloudinary = async (filePath) => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        cloud_api_key: process.env.CLOUDINARY_API_KEY,
        cloud_api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!filePath) {
            return null;
        }
        const uploadResult = await cloudinary_1.v2.uploader.upload(filePath);
        return uploadResult.secure_url;
    }
    catch (error) {
        console.log("uploadOnCloudinary error", error);
        fs_1.default.unlinkSync(filePath);
        console.log("error");
    }
};
exports.default = uploadOnCloudinary;
