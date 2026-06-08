"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genToken = (user) => {
    const AccessToken = jsonwebtoken_1.default.sign({
        userId: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        userId: user._id,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return {
        AccessToken,
        refreshToken,
    };
};
exports.genToken = genToken;
