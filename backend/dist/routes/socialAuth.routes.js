"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const socialRouter = express_1.default.Router();
// GOOGLE 
socialRouter.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
socialRouter.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    res.json({
        message: "Google login success",
        ...req.user,
    });
});
socialRouter.get("/facebook", passport_1.default.authenticate("facebook", { scope: ["email"] }));
socialRouter.get("/facebook/callback", passport_1.default.authenticate("facebook", { session: false }), (req, res) => {
    res.json({
        message: "Facebook login success",
        ...req.user,
    });
});
exports.default = socialRouter;
// FACEBOOK 
