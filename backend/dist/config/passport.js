"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const socialAuth_controller_1 = require("../controller/socialAuth.controller");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:5000/api/social/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const data = await (0, socialAuth_controller_1.googleLogin)(profile);
        done(null, data);
    }
    catch (error) {
        done(error, undefined);
    }
}));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRETE || "",
    callbackURL: "http://localhost:5000/api/social/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const data = await (0, socialAuth_controller_1.facebookLogin)(profile);
        done(null, data);
    }
    catch (error) {
        done(error, undefined);
    }
}));
