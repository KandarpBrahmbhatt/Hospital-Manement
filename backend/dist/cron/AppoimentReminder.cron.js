"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAppointmentReminderJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const appoiment_model_1 = __importDefault(require("../models/appoiment.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const patient_1 = __importDefault(require("../models/patient"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const mail_1 = require("../config/mail");
//reminder mail send karva mate cron scheduler no use kariyo 6e.
const startAppointmentReminderJob = async () => {
    try {
        await (0, mail_1.verifyMailConnection)();
        console.log("Mail server is ready");
    }
    catch (error) {
        console.log("Mail server verification failed:", error);
        return;
    }
    // Every 10 seconds
    node_cron_1.default.schedule("*/24 * * * *", async () => {
        try {
            console.log("Running appointment reminder job...");
            const appointments = await appoiment_model_1.default.find({
                status: { $ne: "Cancelled" },
            });
            console.log(`Appointments Found: ${appointments.length}`);
            for (const appointment of appointments) {
                try {
                    const patient = await patient_1.default.findById(appointment.patientId);
                    const doctor = await Doctor_1.default.findById(appointment.doctorId);
                    if (!patient) {
                        console.log(`Patient not found: ${appointment.patientId}`);
                        continue;
                    }
                    if (!patient.email) {
                        console.log(`No email found for patient ${patient._id}`);
                        continue;
                    }
                    const mailInfo = await (0, mail_1.sendMail)(patient.email, "Appointment Reminder", `
            <h2>Appointment Reminder</h2>

            <p>Dear ${patient.name},</p>

            <p>This is a reminder about your appointment.</p>

            <p><strong>Doctor:</strong> ${doctor?.name || "N/A"}</p>

            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>

            <p>Please arrive 10 minutes early.</p>
            `);
                    console.log(`Email sent to ${patient.email} | Message ID: ${mailInfo.messageId}`);
                    await notification_model_1.default.create({
                        userId: appointment.patientId,
                        title: "Appointment Reminder",
                        message: `Appointment reminder sent for ${new Date(appointment.appointmentDate).toLocaleString()}`,
                        // type: "EMAIL",
                    });
                }
                catch (appointmentError) {
                    console.log("Appointment Processing Error:", appointmentError);
                }
            }
        }
        catch (error) {
            console.log("Appointment Reminder Cron Error:", error);
        }
    });
};
exports.startAppointmentReminderJob = startAppointmentReminderJob;
