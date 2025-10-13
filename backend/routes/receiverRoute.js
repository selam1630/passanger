import express from "express";
import { trackShipment } from "../controllers/receiverController.js";

const router = express.Router();
router.get("/track/:trackingCode", trackShipment);

export default router;
