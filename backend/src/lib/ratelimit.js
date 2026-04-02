import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: { error: "Too many request, please try again later." }
});