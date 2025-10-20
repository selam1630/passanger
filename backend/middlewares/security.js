import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import CryptoJS from 'crypto-js';

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-encryption-key';
const HMAC_SECRET = process.env.HMAC_SECRET || 'fallback-hmac-secret';

// 1. Helmet for Security Headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// 2. Rate Limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Input Sanitization and Validation Middleware
export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 4. Argon2 Password Hashing Utility
export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
};

export const verifyPassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password);
};

// 5. JWT with Rotation
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

// Token rotation logic
export const rotateTokens = (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const newAccessToken = generateAccessToken({ userId: decoded.userId });
  const newRefreshToken = generateRefreshToken({ userId: decoded.userId });
  return { newAccessToken, newRefreshToken };
};

// 6. HMAC for Request Integrity
export const generateHMAC = (data) => {
  return crypto.createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
};

export const verifyHMAC = (data, hmac) => {
  const expectedHMAC = generateHMAC(data);
  return crypto.timingSafeEqual(Buffer.from(expectedHMAC, 'hex'), Buffer.from(hmac, 'hex'));
};

// 7. Encrypted .env (simulated - in production, use proper key management)
export const encryptEnvValue = (value) => {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
};

export const decryptEnvValue = (encryptedValue) => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 8. Field-Level Database Encryption
export const encryptField = (field) => {
  return CryptoJS.AES.encrypt(field, ENCRYPTION_KEY).toString();
};

export const decryptField = (encryptedField) => {
  const bytes = CryptoJS.AES.decrypt(encryptedField, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 9. 2FA Simulation (placeholder - integrate with actual 2FA service)
export const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verify2FACode = (code, storedCode) => {
  return code === storedCode;
};

// 10. Security Audit Logging
export const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${ip} - ${method} ${url}`);
  next();
};

// 11. Cron Job for Security Maintenance (e.g., token cleanup)
cron.schedule('0 0 * * *', () => {
  console.log('Running daily security maintenance...');
  // Implement token cleanup, log rotation, etc.
});

// 12. XSS Protection (additional to Helmet)
export const xssProtection = (req, res, next) => {
  const sanitize = (str) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    }
  }
  next();
};

// 13. SQL Injection Protection (basic - use parameterized queries in controllers)
export const sqlInjectionProtection = (req, res, next) => {
  const sanitizeSQL = (str) => str.replace(/['";\\]/g, '');
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeSQL(req.body[key]);
      }
    }
  }
  next();
};

// 14. CORS Configuration (enhanced)
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 15. Session Management (basic - enhance as needed)
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Export all middlewares for easy integration
export const applySecurityMiddlewares = (app) => {
  app.use(helmetMiddleware);
  app.use(rateLimiter);
  app.use(securityLogger);
  app.use(xssProtection);
  app.use(sqlInjectionProtection);
  // Add more as needed
};