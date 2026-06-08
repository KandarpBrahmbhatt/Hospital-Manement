"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const biil_aggregate_1 = require("../controller/biil.aggregate");
const bill_controller_1 = require("../controller/bill.controller");
const billRouter = express_1.default.Router();
billRouter.post("/create", bill_controller_1.createBill);
billRouter.get("/pdf/:id", bill_controller_1.generateBillPDF);
billRouter.get("/bill", biil_aggregate_1.billListing);
billRouter.get("/list", bill_controller_1.getAllBills);
billRouter.get("/dashboard", biil_aggregate_1.dashboard);
billRouter.post("/create-payment-intent", bill_controller_1.createPaymentIntent);
exports.default = billRouter;
