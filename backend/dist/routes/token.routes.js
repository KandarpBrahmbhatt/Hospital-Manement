"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = require("../controller/token.controller");
const rateLimit_middleware_1 = require("../middaleware/rateLimit.middleware");
const tokenRouter = express_1.default.Router();
tokenRouter.post("/create", token_controller_1.createToken);
tokenRouter.get("/queue/:doctorId", rateLimit_middleware_1.apiLimiter, token_controller_1.getQueueByDoctor);
tokenRouter.put("/next/:doctorId", token_controller_1.callNextPatient);
tokenRouter.put("/start/:tokenId", token_controller_1.startConsultation);
tokenRouter.put("/complete/:tokenId", token_controller_1.completeConsultation);
tokenRouter.get("/dashboard", rateLimit_middleware_1.apiLimiter, token_controller_1.tokenDashboard);
exports.default = tokenRouter;
