"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activity_controller_1 = require("../controller/activity.controller");
const activityRouter = express_1.default.Router();
activityRouter.post("/createActivity", activity_controller_1.createPatientActivity);
activityRouter.get("/:patientId", activity_controller_1.patientTimeline);
exports.default = activityRouter;
