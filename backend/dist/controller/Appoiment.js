"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointments = exports.appointmentHistory = exports.rescheduleAppointment = exports.cancelAppointment = exports.createAppoiment = void 0;
const appoiment_model_1 = __importDefault(require("../models/appoiment.model"));
const mail_1 = require("../config/mail");
const patient_1 = __importDefault(require("../models/patient"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const sms_service_1 = require("../service/sms.service");
const createAppoiment = async (req, res) => {
    try {
        const { doctorId, patientId, appointmentDate, status } = req.body;
        if (!doctorId || !patientId || !appointmentDate) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const parsedAppointmentDate = new Date(appointmentDate);
        if (Number.isNaN(parsedAppointmentDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date",
            });
        }
        const patient = await patient_1.default.findById(patientId);
        const doctor = await Doctor_1.default.findById(doctorId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }
        const appointment = await appoiment_model_1.default.create({
            doctorId,
            patientId,
            appointmentDate: parsedAppointmentDate,
            status: status || "Pending",
            reminderSent: false,
        });
        //PROPER FORMATE MATE USE THAY 6E +91
        const phoneNumber = patient.phone.startsWith("+91")
            ? patient.phone
            : `+91${patient.phone}`;
        // await sendSMS(phoneNumber, "Appointment Booked Successfully");
        // if (patient?.phone) {
        await (0, sms_service_1.sendSMS)(phoneNumber, `Appointment Booked Successfully
         Doctor:${doctor?.name}
         Date: ${new Date(appointment.appointmentDate).toLocaleString()}`);
        // }
        await notification_model_1.default.create({
            userId: patient._id,
            title: "Appointment Confirmed",
            message: "Your appointment has been booked",
        });
        //appoiment book no mail send karvamate lakhiyu 6e and and nu nodemail ni configration config folder ma mail.ts file ma kariyu 6e.
        if (patient.email) {
            await (0, mail_1.sendMail)(patient.email, "Appointment Confirmed", `
        <h2>Appointment Confirmed</h2>

        <p>Doctor: ${doctor.name}</p>
        <p>Date: ${parsedAppointmentDate.toLocaleString()}</p>
        `);
        }
        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment,
        });
    }
    catch (error) {
        console.log("Create Appointment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Create Appointment Error",
            error,
        });
    }
};
exports.createAppoiment = createAppoiment;
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await appoiment_model_1.default.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
        return res.status(200).json({ message: "cancel Appointment sucessfully", appointment, success: true });
    }
    catch (error) {
        console.log("cancelAppoiment error", error);
        return res.status(500).json({ message: "cancel Appointment sucessfully", error });
    }
};
exports.cancelAppointment = cancelAppointment;
const rescheduleAppointment = async (req, res) => {
    const parsedAppointmentDate = new Date(req.body.appointmentDate);
    if (Number.isNaN(parsedAppointmentDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid appointment date",
        });
    }
    const appointment = await appoiment_model_1.default.findByIdAndUpdate(req.params.id, {
        appointmentDate: parsedAppointmentDate,
        reminderSent: false,
    }, { new: true });
    res.json({
        success: true,
        data: appointment
    });
};
exports.rescheduleAppointment = rescheduleAppointment;
const appointmentHistory = async (req, res) => {
    const appointments = await appoiment_model_1.default.find({
        patientId: req.params.patientId
    })
        .populate("doctorId")
        .sort({ appointmentDate: -1 });
    res.json({
        success: true,
        data: appointments
    });
};
exports.appointmentHistory = appointmentHistory;
const getAppointments = async (req, res) => {
    try {
        const appointments = await appoiment_model_1.default.find()
            .populate("patientId")
            .populate("doctorId")
            .sort({ appointmentDate: -1 });
        return res.status(200).json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        console.error("getAppointments error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointments",
            error
        });
    }
};
exports.getAppointments = getAppointments;
