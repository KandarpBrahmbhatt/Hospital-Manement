import { Request, Response } from 'express'
import Appointment from '../models/appoiment.model'
import { sendMail } from '../config/mail'
import Patient from '../models/patient'
import Doctor from '../models/Doctor';
import Notification from '../models/notification.model';
import { sendSMS } from '../service/sms.service';

export const createAppoiment = async (req: Request, res: Response) => {
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

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    
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

    const appointment = await Appointment.create({
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
      await sendSMS(
        phoneNumber,
        `Appointment Booked Successfully
         Doctor:${doctor?.name}
         Date: ${new Date(appointment.appointmentDate).toLocaleString()}`
      );
    // }

    await Notification.create({
      userId: patient._id,
      title: "Appointment Confirmed",
      message: "Your appointment has been booked",
    });

    //appoiment book no mail send karvamate lakhiyu 6e and and nu nodemail ni configration config folder ma mail.ts file ma kariyu 6e.
    if (patient.email) {
      await sendMail(
        patient.email,
        "Appointment Confirmed",
        `
        <h2>Appointment Confirmed</h2>

        <p>Doctor: ${doctor.name}</p>
        <p>Date: ${parsedAppointmentDate.toLocaleString()}</p>
        `
      );
    }

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.log("Create Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Create Appointment Error",
      error,
    });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    return res.status(200).json({ message: "cancel Appointment sucessfully", appointment, success: true })
  } catch (error) {
    console.log("cancelAppoiment error", error)
    return res.status(500).json({ message: "cancel Appointment sucessfully", error })
  }
};


export const rescheduleAppointment = async (req: Request, res: Response) => {
  const parsedAppointmentDate = new Date(req.body.appointmentDate);

  if (Number.isNaN(parsedAppointmentDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment date",
    });
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      appointmentDate: parsedAppointmentDate,
      reminderSent: false,
    },
    { new: true }
  );

  res.json({
    success: true,
    data: appointment
  });
};



export const appointmentHistory = async (req: Request, res: Response) => {
  const appointments = await Appointment.find({
    patientId: req.params.patientId
  })
    .populate("doctorId")
    .sort({ appointmentDate: -1 });

  res.json({
    success: true,
    data: appointments
  });
};
