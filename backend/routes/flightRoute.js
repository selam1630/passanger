import express from "express";
import { addFlight, getAllFlights, updateFlightStatus } from "../controllers/flightController.js";
import { authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/add", authenticateUser, addFlight);
router.get("/get", getAllFlights);
router.put("/:flightId/status", authenticateUser, updateFlightStatus);

export default router;
