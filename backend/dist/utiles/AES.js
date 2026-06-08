"use strict";
// encryption decretpion utility file
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
// const secretKey = "sdsdfskldfsdfsdklfsdksklfjfjdjd"
// export const encryptData = (data:string) => {
//     return CryptoJS.AES.encrypt(data, secretKey).toString()
// }
// export const decryptData = (encryptData:string) => {
//     const bytes = CryptoJS.AES.decrypt(encryptData, secretKey)
//     return bytes.toString(CryptoJS.enc.UTF8)
// }
const secretKey = "sdsdfskldfsdfsdklfsdksklfjfjdjd";
const encryptData = (data) => {
    return crypto_js_1.default.AES.encrypt(data, secretKey).toString();
};
exports.encryptData = encryptData;
const decryptData = (encryptedData) => {
    const bytes = crypto_js_1.default.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptData = decryptData;
/* THIS FIIE DOES
ENCRYPTION
DECRYPTION
*/ 
