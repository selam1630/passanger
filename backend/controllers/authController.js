import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendSms } from './smsController.js';
import crypto from 'crypto'; 

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, nationalID, role } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
        nationalID,
        role,
        nationalIDVerified: false,
        phoneVerified: false,
      },
    });
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
    await prisma.user.update({
      where: { id: newUser.id },
      data: { otpCode: otp, otpExpiry: expiryTime },
    });

    await sendSms(phone, `Your FlightBridge verification code is ${otp}`);
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(201).json({
      message: 'User registered successfully. OTP sent to your phone.',
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // req.user is set by your authMiddleware
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        nationalID: true,
        role: true,
        phoneVerified: true,
        nationalIDVerified: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });

  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
