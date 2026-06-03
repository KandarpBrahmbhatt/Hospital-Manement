import { Request, Response } from 'express'
import Appointment from '../models/appoiment.model'

export const createAppoiment = async (req: Request, res: Response) => {
    try {
        const { doctorId, patientId, appointmentDate, status } = req.body
        console.log(req.body)

        if (!doctorId || !patientId || !appointmentDate) {
            return res.status(400).json({ message: "all filed are required" })
        }

        const appoiment = await Appointment.create({
            doctorId,
            patientId,
            appointmentDate,
            status
        })

        return res.status(200).json({ message: "appoiment create sucessfully", appoiment })
    } catch (error) {
        console.log("create Appiment error", error)
        return res.status(500).json({ message: "ceateAppiment error", error })
    }
}

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
         return res.status(500).json({ message: "cancel Appointment sucessfully",error })
    }
};


export const rescheduleAppointment = async (req: Request, res: Response) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      appointmentDate: req.body.appointmentDate
    },
    { new: true }
  );

  res.json({
    success: true,
    data: appointment
  });
};



export const appointmentHistory = async (req:Request, res:Response) => {
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