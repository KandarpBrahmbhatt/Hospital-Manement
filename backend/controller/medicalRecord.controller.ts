import { Request, Response } from 'express'
import MedicalRecord from '../models/medicalRecord.model'
import patient from '../models/patient'

//create medicalRecord

export const createMedicalRecord = async (req: Request, res: Response) => {
    try {
        const { patientId, doctorId, diagnosis, prescription, allergies, treatmentNotes } = req.body
        console.log(req.body)

        const medicalRecord = await MedicalRecord.create({
            patientId,
            doctorId,
            diagnosis,
            prescription,
            allergies,
            treatmentNotes
        })

        return res.status(201).json({ message: "createMedicalRecord sucessfully", medicalRecord })
    } catch (error) {
        console.log("createMedicalRecord error", error)
        return res.status(500).json({ message: "createMedicalRecord sucessfully", error })
    }
}

//getting patientHistory

export const getPatientHistory = async (req: Request, res: Response) => {
    try {
        //.populate mathod no use karavathi doctorId aetate doctor not badho data join thase output ma. jo  sepecifice vastu pan karvu hoy to thase ae jfild add thase.
        const record = await MedicalRecord.find({ patientId: req.params.patientId }).populate("doctorId").sort({ createdAt: -1 })

        return res.status(200).json({ message: "getPatientHistory sucessfully", record })
    } catch (error) {
        console.log("getPatintHistory error", error)
        return res.status(200).json({ message: "getPatientHistory sucessfully", error })
    }
}

//geting single medicalrecord 

export const getMedicalRecordById = async (req: Request, res: Response) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate("patientId")
            .populate("doctorId");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update Record

export const updateMedicalRecord = async (req: Request, res: Response) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true })

        return res.status(200).json({ message: "updateMedicalRecord sucessfully", medicalRecord })
    } catch (error) {
        console.log("updateMedicalRecord error", error)
        return res.status(500).json({ message: "updateMedicalRecord error", error })
    }
}

//delete medical record
export const deletedMedicalRecord = async (req: Request, res: Response) => {
    try {
        const medicalRecord = await MedicalRecord.findByIdAndDelete(req.params.id)

        if (!medicalRecord) {
            return res.status(400).json({ message: "medicalRecord not found" })
        }

        return res.status(200).json({ message: "deletedMedicalRecord sucessfully", deletedMedicalRecord })
    } catch (error) {
        console.log("deletedMedicalRecord error", error)
        return res.status(200).json({ message: "deletedMedicalRecord error", error })
    }
}

// export const uploadLabReport = async (req: Request, res: Response) => {
//     try {
//         const record = await MedicalRecord.findById(req.params.id);

//         if (!record) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Record not found",
//             });
//         }

//         record.labReports.push({
//             fileUrl: req.file?.path || "",
//             uploadedAt: new Date(),
//         });

//         await record.save();

//         return res.status(200).json({
//             success: true,
//             message: "Lab report uploaded",
//             data: record,
//         });
//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

//medicalDashboard aggragation 

export const medicalDashboard = async (req: Request, res: Response) => {
    try {
        const stats = await MedicalRecord.aggregate([
            {
                $facet: {
                    totalRecords: [
                        {
                            $count: "count",
                        },
                    ],

                    commonDiseases: [
                        {
                            $group: {
                                _id: "$diagnosis",
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $sort: {
                                count: -1,
                            },
                        },
                        {
                            $limit: 5,
                        },
                    ],
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// import puppeteer from "puppeteer";
import { sendMail } from '../config/mail'
import { generatePdfBuffer } from '../utiles/pdfgenarateBuffer'

// export const generateMedicalRecordPdf = async (
//     req: Request,
//     res: Response
// ) => {
//     let browser;

//     try {
//         const record = await MedicalRecord.findById(req.params.id)
//             .populate("patientId")
//             .populate("doctorId");

//         if (!record) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Record not found",
//             });
//         }

//         // DEBUG (IMPORTANT)
//         console.log("MEDICAL RECORD =>", record);

//         browser = await puppeteer.launch({
//             headless: true,
//         });

//         const page = await browser.newPage();

//         const patient: any = record.patientId;
//         const doctor: any = record.doctorId;

//         const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <style>

// body {
//   font-family: Arial, sans-serif;
//   padding: 30px;
//   background: #f7f7f7;
// }

// .box {
//   background: #fff;
//   padding: 30px;
//   border-radius: 10px;
//   box-shadow: 0 0 10px rgba(0,0,0,0.1);
// }

// .header {
//   text-align: center;
//   border-bottom: 2px solid #eee;
//   padding-bottom: 15px;
//   margin-bottom: 20px;
// }

// .header h1 {
//   margin: 0;
//   color: #2c3e50;
// }

// .sub {
//   font-size: 13px;
//   color: #888;
// }

// .section {
//   margin-bottom: 25px;
// }

// .title {
//   font-size: 16px;
//   font-weight: bold;
//   color: #34495e;
//   border-left: 4px solid #3498db;
//   padding-left: 10px;
//   margin-bottom: 10px;
// }

// table {
//   width: 100%;
//   border-collapse: collapse;
// }

// td, th {
//   padding: 10px;
//   border-bottom: 1px solid #eee;
// }

// .label {
//   width: 30%;
//   color: #777;
// }

// .value {
//   font-weight: bold;
//   color: #2c3e50;
// }

// .diagnosis {
//   background: #fff8e1;
//   padding: 15px;
//   border-left: 5px solid #f39c12;
//   border-radius: 5px;
// }

// ul {
//   padding-left: 20px;
// }

// .footer {
//   margin-top: 30px;
//   text-align: center;
//   font-size: 12px;
//   color: #999;
// }

// </style>
// </head>

// <body>

// <div class="box">

//   <div class="header">
//     <h1>🏥 Medical Record</h1>
//     <div class="sub">Hospital Management System</div>
//   </div>

//   <div class="section">
//     <div class="title">Patient Details</div>

//     <table>
//       <tr>
//         <td class="label">Name</td>
//         <td class="value">${patient?.name || "N/A"}</td>
//       </tr>

//       <tr>
//         <td class="label">Doctor</td>
//         <td class="value">${doctor?.name || "N/A"}</td>
//       </tr>

//       <tr>
//         <td class="label">Date</td>
//         <td class="value">${record.createdAt
//                 ? new Date(record.createdAt).toLocaleDateString()
//                 : "N/A"
//             }</td>
//       </tr>
//     </table>
//   </div>

//   <div class="section">
//     <div class="title">Diagnosis</div>
//     <div class="diagnosis">
//       ${record.diagnosis || "N/A"}
//     </div>
//   </div>

//   <div class="section">
//     <div class="title">Symptoms</div>
//     <ul>
//       ${(record.symptoms || [])
//                 .map((s: string) => `<li>${s}</li>`)
//                 .join("")}
//     </ul>
//   </div>

//   <div class="section">
//     <div class="title">Prescription</div>

//     <table>
//       <tr>
//         <th>Medicine</th>
//         <th>Dosage</th>
//         <th>Duration</th>
//       </tr>

//       ${(record.prescription || [])
//                 .map(
//                     (p: any) => `
//           <tr>
//             <td>${p.medicine || "-"}</td>
//             <td>${p.dosage || "-"}</td>
//             <td>${p.duration || "-"}</td>
//           </tr>
//         `
//                 )
//                 .join("")}
//     </table>
//   </div>

//   <div class="footer">
//     Confidential Medical Record • Generated Automatically
//   </div>

// </div>

// </body>
// </html>
// `;

//         await page.setContent(html, {
//             // waitUntil: "networkidle0",
//         });

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//         });

//         await browser.close();

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename=medical-record-${record._id}.pdf`,
//         });

//         return res.send(pdfBuffer);
//     } catch (error) {
//         console.log("PDF ERROR:", error);

//         if (browser) await browser.close();

//         return res.status(500).json({
//             success: false,
//             message: "PDF generation failed",
//         });
//     }
// };


export const downloadAndEmailMedicalPdf = async (
  req: Request,
  res: Response
) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate("patientId")
      .populate("doctorId");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const patient: any = record.patientId;
    const doctor: any = record.doctorId;

    // HTML TEMPLATE
    const html = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          background: #f7f7f7;
        }

        .invoice-box {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #eee;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .header h1 {
          margin: 0;
          font-size: 26px;
          color: #2c3e50;
        }

        .sub {
          color: #888;
          font-size: 14px;
        }

        .section {
          margin-bottom: 20px;
        }

        .title {
          font-size: 16px;
          color: #34495e;
          border-left: 4px solid #3498db;
          padding-left: 10px;
          margin-bottom: 10px;
          font-weight: bold;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        table td, table th {
          padding: 10px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }

        .label {
          color: #777;
          width: 40%;
        }

        .value {
          font-weight: bold;
          color: #2c3e50;
        }

        .diagnosis-box {
          background: #fff8e1;
          padding: 15px;
          border-left: 5px solid #f39c12;
          border-radius: 5px;
          font-weight: bold;
          color: #2c3e50;
        }

        .notes-box {
          background: #f0f4f8;
          padding: 15px;
          border-left: 5px solid #3498db;
          border-radius: 5px;
          color: #2c3e50;
          font-style: italic;
        }

        ul {
          padding-left: 20px;
          margin: 0;
        }

        li {
          padding: 3px 0;
          color: #2c3e50;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>

    <body>
      <div class="invoice-box">

        <div class="header">
          <h1>🏥 Medical Record</h1>
          <div class="sub">Medical Record generated automatically</div>
        </div>

        <div class="section">
          <div class="title">Patient & Doctor Details</div>
          <table>
            <tr>
              <td class="label">Patient Name</td>
              <td class="value">${patient?.name || "N/A"}</td>
            </tr>
            <tr>
              <td class="label">Doctor Name</td>
              <td class="value">${doctor?.name || "N/A"}</td>
            </tr>
            <tr>
              <td class="label">Date</td>
              <td class="value">${
                record.createdAt
                  ? new Date(record.createdAt).toLocaleDateString()
                  : "N/A"
              }</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="title">Diagnosis</div>
          <div class="diagnosis-box">
            ${record.diagnosis || "N/A"}
          </div>
        </div>

        ${record.symptoms && record.symptoms.length > 0 ? `
        <div class="section">
          <div class="title">Symptoms</div>
          <ul>
            ${record.symptoms.map((s: string) => `<li>${s}</li>`).join("")}
          </ul>
        </div>
        ` : ""}

        ${record.allergies && record.allergies.length > 0 ? `
        <div class="section">
          <div class="title">Allergies</div>
          <ul>
            ${record.allergies.map((a: string) => `<li>${a}</li>`).join("")}
          </ul>
        </div>
        ` : ""}

        <div class="section">
          <div class="title">Prescription</div>
          <table>
            <thead>
              <tr>
                <th style="color: #777; width: 40%;">Medicine</th>
                <th style="color: #777; width: 30%;">Dosage</th>
                <th style="color: #777; width: 30%;">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${(record.prescription || [])
                .map(
                  (p: any) => `
                    <tr>
                      <td class="value">${p.medicine || "-"}</td>
                      <td class="value">${p.dosage || "-"}</td>
                      <td class="value">${p.duration || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        ${record.treatmentNotes ? `
        <div class="section">
          <div class="title">Treatment Notes</div>
          <div class="notes-box">
            ${record.treatmentNotes}
          </div>
        </div>
        ` : ""}

        ${record.doctorRemarks ? `
        <div class="section">
          <div class="title">Doctor Remarks</div>
          <div class="notes-box">
            ${record.doctorRemarks}
          </div>
        </div>
        ` : ""}

        <div class="footer">
          Confidential Medical Record • Hospital Management System 💙
        </div>

      </div>
    </body>
    </html>
    `;

    // 1. Generate PDF
    const pdfBuffer = await generatePdfBuffer(html);

    // 2. Send Email
    await sendMail(
      patient?.email,
      "Your Medical Record PDF",
      "Please find attached your medical record PDF.",
      pdfBuffer,
      `medical-record-${record._id}.pdf`
    );

    // 3. Download response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=medical-record-${record._id}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate and send PDF",
    });
  }
};

export const getMedicalRecord = async (req: Request, res: Response) => {
    try {
        const medicalRecord = await MedicalRecord.find()

        return res.status(200).json({ message: "gettingMedicalRecord sucessufully", medicalRecord })
    } catch (error) {
        console.log("getMedicalRecord error")
        return res.status(500).json({ message: "gettingMedicalRecord sucessufully", error })
    }
}

