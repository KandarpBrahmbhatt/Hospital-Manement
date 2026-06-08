// encryption decretpion utility file

import CryptoJS from 'crypto-js'

// const secretKey = "sdsdfskldfsdfsdklfsdksklfjfjdjd"

// export const encryptData = (data:string) => {
//     return CryptoJS.AES.encrypt(data, secretKey).toString()
// }

// export const decryptData = (encryptData:string) => {
//     const bytes = CryptoJS.AES.decrypt(encryptData, secretKey)
//     return bytes.toString(CryptoJS.enc.UTF8)
// }

const secretKey = "sdsdfskldfsdfsdklfsdksklfjfjdjd"

export const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
/* THIS FIIE DOES 
ENCRYPTION
DECRYPTION
*/