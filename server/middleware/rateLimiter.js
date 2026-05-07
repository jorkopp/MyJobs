const rateLimit = require("express-rate-limit");

/**
 * Broad API rate limit to reduce abuse (brute force, scraping).
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

/**
 * Stricter limit on auth routes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

module.exports = { apiLimiter, authLimiter };
