import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './config/db.js';

import authRoute from './routes/authRoute.js';
import otpRoute from './routes/otpRoute.js';
import smsRoute from './routes/smsRoute.js';
import flightRoute from './routes/flightRoute.js';
import testRoute from './routes/testRoute.js';
import senderRoute from './routes/senderRoute.js';
import receiverRoute from "./routes/receiverRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import supportRoute from "./routes/supportRoutes.js"; 

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
app.use('/api/support', supportRoute);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  const testRoom = '68eca0dbcbe52ca522fe826d';
  socket.join(testRoom);
  console.log(`Socket ${socket.id} joined room ${testRoom}`);
  setTimeout(() => {
    const testMessage = {
      userId: testRoom,
      agentId: 'AGENT_1',
      message: 'Hello from backend!',
      sentBy: 'agent',
      createdAt: new Date(),
    };
    io.to(testRoom).emit('receiveMessage', testMessage);
    console.log('Sent test message to room:', testRoom);
  }, 2000);

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
