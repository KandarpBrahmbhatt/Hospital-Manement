"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const biil_routes_1 = __importDefault(require("./routes/biil.routes"));
const db_1 = __importDefault(require("./config/db"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const department_routes_1 = __importDefault(require("./routes/department.routes"));
const Patient_rotues_1 = __importDefault(require("./routes/Patient.rotues"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const emargancy_routes_1 = __importDefault(require("./routes/emargancy.routes"));
const token_routes_1 = __importDefault(require("./routes/token.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const appoiment_route_1 = __importDefault(require("./routes/appoiment.route"));
const AppoimentReminder_cron_1 = require("./cron/AppoimentReminder.cron");
const ward_routes_1 = __importDefault(require("./routes/ward.routes"));
const medicalRecord_routes_1 = __importDefault(require("./routes/medicalRecord.routes"));
const socialAuth_routes_1 = __importDefault(require("./routes/socialAuth.routes"));
// Import passport and its configuration to register the authentication strategies
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));
// Initialize passport middleware
app.use(passport_1.default.initialize());
app.use("/api", biil_routes_1.default);
app.use("/api", doctor_routes_1.default);
app.use("/api", department_routes_1.default);
app.use("/api/patient", Patient_rotues_1.default);
app.use("/api/activity", activity_routes_1.default);
app.use("/api/emargancy", emargancy_routes_1.default);
app.use("/api/token", token_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/appoiment", appoiment_route_1.default);
app.use("/api/ward", ward_routes_1.default);
app.use("/api/medicalrecord", medicalRecord_routes_1.default);
// Register social router under /api/social to match the passport callback URL
app.use("/api/social", socialAuth_routes_1.default);
const port = 5000;
app.listen(port, async () => {
    console.log("server started", port);
    await (0, db_1.default)();
    await (0, AppoimentReminder_cron_1.startAppointmentReminderJob)();
});
