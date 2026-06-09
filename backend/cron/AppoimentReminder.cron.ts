import cron from "node-cron";
import Appointment from "../models/appoiment.model";
import Notification from "../models/notification.model";
import Patient from "../models/patient";
import Doctor from "../models/Doctor";
import { sendMail, verifyMailConnection } from "../config/mail";
// Change: Import the Socket.io server instance to send reminders in real-time
import { io } from "../backend";

//reminder mail send karva mate cron scheduler no use kariyo 6e.
export const startAppointmentReminderJob = async () => {
  try {
    await verifyMailConnection();
    console.log("Mail server is ready");
  } catch (error) {
    console.log("Mail server verification failed:", error);
    return;
  }

  // Every 10 seconds
  // CORRECTED: Changed from "* * * * */24" to "*/10 * * * * *" because node-cron supports seconds as the first (6th optional) field,
  // and the previous pattern was invalid because the day-of-week step "/24" is out of the valid range (0-6).
  cron.schedule("*/10 * * * * *", async () => {
    try {
      console.log("Running appointment reminder job...");

      const appointments = await Appointment.find({
        status: { $ne: "Cancelled" },
      });

      console.log(`Appointments Found: ${appointments.length}`);

      for (const appointment of appointments) {
        try {
          const patient: any = await Patient.findById(
            appointment.patientId
          );

          const doctor: any = await Doctor.findById(
            appointment.doctorId
          );

          if (!patient) {
            console.log(
              `Patient not found: ${appointment.patientId}`
            );
            continue;
          }

          if (!patient.email) {
            console.log(
              `No email found for patient ${patient._id}`
            );
            continue;
          }

          const mailInfo = await sendMail(
            patient.email,
            "Appointment Reminder",
            `
            <h2>Appointment Reminder</h2>

            <p>Dear ${patient.name},</p>

            <p>This is a reminder about your appointment.</p>

            <p><strong>Doctor:</strong> ${
              doctor?.name || "N/A"
            }</p>

            <p><strong>Date:</strong> ${new Date(
              appointment.appointmentDate
            ).toLocaleString()}</p>

            <p>Please arrive 10 minutes early.</p>
            `
          );

          console.log(
            `Email sent to ${patient.email} | Message ID: ${mailInfo.messageId}`
          );

          // Change: Save notification and store reference to emit via WebSockets
          const notification = await Notification.create({
            userId: appointment.patientId,
            title: "Appointment Reminder",
            message: `Appointment reminder sent for ${new Date(
              appointment.appointmentDate
            ).toLocaleString()} (Email sent to ${patient.email})`,
            notificationtype: "SYSTEM", // Fix/align notification type
            isRead: false
          });

          // Change: Emit the reminder notification to connected clients
          io.emit("newNotification", notification);
        } catch (appointmentError) {
          console.log(
            "Appointment Processing Error:",
            appointmentError
          );
        }
      }
    } catch (error) {
      console.log(
        "Appointment Reminder Cron Error:",
        error
      );
    }
  });
};