"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ward_controller_1 = require("../controller/ward.controller");
const rateLimit_middleware_1 = require("../middaleware/rateLimit.middleware");
const wardRouter = express_1.default.Router();
wardRouter.post("/create", ward_controller_1.createWard);
wardRouter.get("/get", rateLimit_middleware_1.apiLimiter, ward_controller_1.getAllWard);
wardRouter.put("/update/:id", rateLimit_middleware_1.apiLimiter, ward_controller_1.updateWard);
wardRouter.delete("/delete/:id", rateLimit_middleware_1.apiLimiter, ward_controller_1.deleteWard);
wardRouter.get("/wardDashboard", rateLimit_middleware_1.apiLimiter, ward_controller_1.wardDashboard);
exports.default = wardRouter;
