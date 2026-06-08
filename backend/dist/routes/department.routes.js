"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deparment_aggregate_1 = require("../controller/deparment.aggregate");
const rateLimit_middleware_1 = require("../middaleware/rateLimit.middleware");
const departmentRouter = express_1.default.Router();
departmentRouter.get("/department", rateLimit_middleware_1.apiLimiter, deparment_aggregate_1.departmentListing);
exports.default = departmentRouter;
