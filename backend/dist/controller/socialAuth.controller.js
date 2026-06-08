"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookLogin = exports.googleLogin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleLogin = async (profile) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    let user = await user_model_1.default.findOne({ email });
    if (user) {
        if (!user.providers) {
            user.providers = {};
        }
        user.providers.google = {
            id, email
        };
        if (!user.name)
            user.name = displayName;
        if (!user.avatar)
            user.avatar = photos?.[0]?.value;
        await user.save();
    }
    else {
        user = await user_model_1.default.create({
            name: displayName,
            email,
            avatar: photos?.[0]?.value,
            providers: {
                google: { id, email }
            }
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "7d"
    });
    return { user, token };
};
exports.googleLogin = googleLogin;
const facebookLogin = async (profile) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value || `${id}@facebook.com`;
    let user = await user_model_1.default.findOne({ email });
    if (user) {
        if (!user.providers) {
            user.providers = {};
        }
        user.providers.facebook = {
            id,
            email
        };
        if (!user.name)
            user.name = displayName;
        if (!user.avatar)
            user.avatar = photos?.[0]?.value;
        await user.save();
    }
    else {
        user = await user_model_1.default.create({
            name: displayName,
            email,
            avatar: photos?.[0]?.value,
            providers: {
                facebook: { id, email }
            }
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "7d"
    });
    return { user, token };
};
exports.facebookLogin = facebookLogin;
