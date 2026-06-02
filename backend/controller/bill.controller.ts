import puppeteer from "puppeteer";
import Bill from "../models/bill";
import Patient from "../models/patient";
import { Request,Response } from "express";
export const generateBillPDF = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("patientId");

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found"
      });
    }

    const patient = bill.patientId as any;
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
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .label {
      color: #777;
      width: 40%;
    }

    .value {
      font-weight: bold;
      color: #2c3e50;
    }

    .total {
      background: #ecf9f1;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      color: #27ae60;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }

    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      background: #3498db;
      color: #fff;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <div class="invoice-box">

    <div class="header">
      <h1>🏥 Hospital Invoice</h1>
      <div class="sub">Invoice generated automatically</div>
    </div>

    <div class="section">
      <div class="title">Patient Details</div>
      <table>
        <tr>
          <td class="label">Name</td>
          <td class="value">${patient?.name}</td>
        </tr>
        <tr>
          <td class="label">Age</td>
          <td class="value">${patient?.age}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">${patient?.email || "N/A"}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <div class="title">Billing Information</div>

      <div class="total">
        Total Amount: ₹${bill.amount}
      </div>
    </div>

    <div class="section">
      <div class="title">Insurance Details</div>
      <table>
        <tr>
          <td class="label">Provider</td>
          <td class="value">${patient?.insurance?.providerName || "N/A"}</td>
        </tr>
        <tr>
          <td class="label">Covered</td>
          <td class="value">
            ${patient?.insurance?.hasInsurance ? "Yes" : "No"}
          </td>
        </tr>
      </table>
    </div>

    <div class="footer">
      Thank you for choosing our hospital 💙
    </div>

  </div>
</body>
</html>
`;

// means you are starting a Chrome browser using Puppeteer in the background (without UI).
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4"
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=bill.pdf"
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "PDF generation failed"
    });
  }
};