"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patitentCRUD_1 = require("../controller/patitentCRUD");
const auth_middleware_1 = require("../middaleware/auth.middleware");
const patientRouter = express_1.default.Router();
patientRouter.get("/agg", patitentCRUD_1.dashboardAnalytics);
patientRouter.post("/create", patitentCRUD_1.createPatient);
patientRouter.get("/getPatientList", auth_middleware_1.isAuth, (0, auth_middleware_1.authorize)("patient:view"), patitentCRUD_1.getPatientList);
patientRouter.get("/:id", patitentCRUD_1.getSinglePatient);
patientRouter.put("/:id", patitentCRUD_1.updatePatient);
exports.default = patientRouter;
