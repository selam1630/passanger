import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const authenticateUser = (allowedRoles = []) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found. Invalid token.' });
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have access to this resource.' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};
