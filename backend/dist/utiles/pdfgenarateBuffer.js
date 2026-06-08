"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfBuffer = void 0;
// utils/pdf.ts
const puppeteer_1 = __importDefault(require("puppeteer"));
const generatePdfBuffer = async (html) => {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, {
        waitUntil: "domcontentloaded",
    });
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
    });
    await browser.close();
    return pdf;
};
exports.generatePdfBuffer = generatePdfBuffer;
