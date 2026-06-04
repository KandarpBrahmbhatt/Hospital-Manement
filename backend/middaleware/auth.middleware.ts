import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuth = ( req: any, res: Response,next: NextFunction) => {
  try {
    const token = req.cookies?.AccessToken;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET!);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};


import User from "../models/user.model";

export const authorize =(...permissions: string[]) => async (req: any,res: Response,next: NextFunction) => {
    try {
      const user =await User.findById(req.user.userId).populate("roleId");

      if (!user) {
        return res.status(404).json({message: "User not found",});
      }

      const role: any = user.roleId;

      // ADMIN has all access
      if (role.permissions.includes("*") ) {
        return next();
      }

      const hasPermission = permissions.some((permission) => role.permissions.includes(permission)
        );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access Denied",
        });
      }

      next();
    } catch (error) {
      console.log(error);
    }
  };