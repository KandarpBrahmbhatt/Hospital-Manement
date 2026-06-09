import bcrypt from "bcryptjs";
import User from "../models/user.model";
import Role from "../models/roll.model";
import { Request, Response } from 'express'
import { genToken } from "../config/token";
import { emailQueue } from "../queues/email.queues";
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
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, confirm_password, roleId } = req.body;

        // password match check
        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        // email exists?
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // role exists?
        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({
                message: "Invalid role",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to DB

        await emailQueue.add("welcome-email", {
            email,
        });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            roleId,
        });

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error);
    }
};

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

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;
        // Find user with role
        const user = await User.findOne({
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

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate tokens
        const { AccessToken, refreshToken, } = genToken(user);

        // Store in cookies
        res.cookie("AccessToken", AccessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            }
        );

        res.cookie("RefreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge:
                7 * 24 * 60 * 60 * 1000,
        }
        );

        res.status(200).json({
            success: true, message: "Login Success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: (user.roleId as any)
                    ?.name,
            },
        });
    } catch (error) {
        console.log("Login Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getRoles = async (req: Request, res: Response) => {
    try {
        //.select karni ne lakhta only  permistion name show thase
        const roles = await Role.find().select("name permissions");
        res.status(200).json({
            message: "gettingRoles sucessfully",
            success: true,
            roles,
        });
    } catch (error) {
        console.log("getRoles Error", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};