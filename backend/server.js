import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import otpRoute from './routes/otpRoute.js';
import smsRoute from './routes/smsRoute.js';
import flightRoute from './routes/flightRoute.js';
import testRoute from './routes/testRoute.js';
import senderRoute from './routes/senderRoute.js';
import receiverRoute from "./routes/receiverRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/otp', otpRoute);
app.use('/api/sms', smsRoute);
app.use('/api/flights', flightRoute);
app.use('/api/sender', senderRoute);
app.use('/api/receiver', receiverRoute);
app.use('/api/payment', paymentRoute);

app.use('/api', testRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
