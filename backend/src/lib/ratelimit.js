import { rateLimit } from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: { error: "Too many request, please try again later." }
});

export const routeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {error: "Too many request, please try again later."}
});