import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()

export const genToken = (user: any) => {
    const AccessToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "15m",
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: "7d",
        }
    );

    return {
        AccessToken,
        refreshToken,
    };
};