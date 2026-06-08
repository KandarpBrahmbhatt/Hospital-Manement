"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const roll_model_1 = __importDefault(require("../models/roll.model"));
const token_1 = require("../config/token");
/*
User Signup
    ↓
Receive roleId
    ↓
Validate role exists
    ↓
Hash password
    ↓
Create user
 */
const signup = async (req, res) => {
    try {
        const { name, email, password, confirm_password, roleId } = req.body;
        // password match check
        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }
        // email exists?
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        // role exists?
        const role = await roll_model_1.default.findById(roleId);
        if (!role) {
            return res.status(404).json({
                message: "Invalid role",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            roleId,
        });
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.signup = signup;
/*
Email + Password
      ↓
Find User
      ↓
Compare Password
      ↓
Generate JWT
      ↓
Store in Cookie
*/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user with role
        const user = await user_model_1.default.findOne({
            email,
        }).populate("roleId");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Password not found",
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Generate tokens
        const { AccessToken, refreshToken, } = (0, token_1.genToken)(user);
        // Store in cookies
        res.cookie("AccessToken", AccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true, message: "Login Success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.roleId
                    ?.name,
            },
        });
    }
    catch (error) {
        console.log("Login Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.login = login;
const getRoles = async (req, res) => {
    try {
        //.select karni ne lakhta only  permistion name show thase
        const roles = await roll_model_1.default.find().select("name permissions");
        res.status(200).json({
            message: "gettingRoles sucessfully",
            success: true,
            roles,
        });
    }
    catch (error) {
        console.log("getRoles Error", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getRoles = getRoles;
