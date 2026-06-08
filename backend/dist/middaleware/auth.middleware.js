"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    try {
        const token = req.cookies?.AccessToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
};
exports.isAuth = isAuth;
const user_model_1 = __importDefault(require("../models/user.model"));
const authorize = (...permissions) => async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.user.userId).populate("roleId");
        if (!user) {
            return res.status(404).json({ message: "User not found", });
        }
        const role = user.roleId;
        // ADMIN has all access
        if (role.permissions.includes("*")) {
            return next();
        }
        const hasPermission = permissions.some((permission) => role.permissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({
                message: "Access Denied",
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
    }
};
exports.authorize = authorize;
