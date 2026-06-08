"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emargancy_controller_1 = require("../controller/emargancy.controller");
const emargancyRouter = express_1.default.Router();
emargancyRouter.post("/create", emargancy_controller_1.createEmaragancyEntry);
emargancyRouter.get("/list", emargancy_controller_1.getEmergencyList);
emargancyRouter.get("/stats", emargancy_controller_1.getEmergencyStats);
emargancyRouter.get("/:id", emargancy_controller_1.getSingleEmergency);
emargancyRouter.put("/:id", emargancy_controller_1.updateEmergency);
emargancyRouter.delete("/:id", emargancy_controller_1.deleteEmergency);
exports.default = emargancyRouter;
