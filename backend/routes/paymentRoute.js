import express from "express";
import { initializePayment, releasePayment } from "../controllers/paymentController.js";

const router = express.Router();
router.post("/initialize", initializePayment);
router.post("/release", releasePayment);

export default router;
