import redis from "../config/redis";
import bill from "../models/bill";
import { Request, Response } from "express";

export const billListing = async (req: Request, res: Response) => {
  try {

    const cacheKey = `billlisting`

    const cached = await redis.get(cacheKey)
    if (cached) {
      console.log("Cache HIT")
      return res.status(200).json({ source: "redis", ...JSON.parse(cached) })
    }
    console.log("Cache MISS")
    const result = await bill.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $lookup: {
          from: "departments",
          localField: "doctor.departmentId", //doctor ni andar department id 6e 
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $group: {
          _id: "$department.name",
          totalRevenue: {
            $sum: "$amount",
          },
          totalBills: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);
    const data = {
      result
    }
    await redis.set(cacheKey, JSON.stringify(data))
    return res.status(200).json({ message: "getting billListing sucessfully", ...data, source: "DataBase" })
  } catch (error) {
    res.status(500).json(error);
  }
};


export const dashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await bill.aggregate([
      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                revenue: {
                  $sum: "$amount",
                },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],

          totalBills: [
            {
              $count: "count",
            },
          ],

          averageBill: [
            {
              $group: {
                _id: null,
                avgBill: {
                  $avg: "$amount",
                },
              },
            },
            //id show nahi thay aetLE Lkhiyu 6e
            {
              $project: {
                _id: 0,
              },
            },
          ],
        },
      },
    ]);
    
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};


// import puppeteer from "puppeteer";
// import Bill from "../models/bill";
// import Patient from "../models/patient";

// export const generateBillPDF = async (req, res) => {
//   try {
//     const bill = await Bill.findById(req.params.id)
//       .populate("patientId");

//     const patient = bill.patientId;

//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial; padding: 20px; }
//             .header { text-align: center; }
//             .box { margin-top: 20px; }
//           </style>
//         </head>

//         <body>
//           <div class="header">
//             <h1>Hospital Bill Invoice</h1>
//           </div>

//           <div class="box">
//             <h3>Patient Details</h3>
//             <p>Name: ${patient.name}</p>
//             <p>Age: ${patient.age}</p>
//           </div>

//           <div class="box">
//             <h3>Billing Details</h3>
//             <p>Total Amount: ₹${bill.amount}</p>
//             <p>Status: ${bill.status}</p>
//           </div>

//           <div class="box">
//             <h3>Insurance</h3>
//             <p>Provider: ${patient.insurance?.providerName || "N/A"}</p>
//             <p>Covered: ${patient.insurance?.hasInsurance ? "Yes" : "No"}</p>
//           </div>
//         </body>
//       </html>
//     `;

//     const browser = await puppeteer.launch({
//       headless: "new"
//     });

//     const page = await browser.newPage();

//     await page.setContent(html);

//     const pdfBuffer = await page.pdf({
//       format: "A4"
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=bill.pdf"
//     });

//     return res.send(pdfBuffer);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "PDF generation failed" });
//   }
// };