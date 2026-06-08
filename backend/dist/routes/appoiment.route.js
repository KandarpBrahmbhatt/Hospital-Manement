"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Appoiment_1 = require("../controller/Appoiment");
const appoimentRouter = express_1.default.Router();
appoimentRouter.post("/create", Appoiment_1.createAppoiment);
appoimentRouter.get("/", Appoiment_1.getAppointments);
appoimentRouter.put("/cancel/:id", Appoiment_1.cancelAppointment);
appoimentRouter.put("/reschedule/:id", Appoiment_1.rescheduleAppointment);
appoimentRouter.get("/history/:patientId", Appoiment_1.appointmentHistory);
exports.default = appoimentRouter;
