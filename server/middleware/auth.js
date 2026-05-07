const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const COOKIE_NAME = "mj_token";

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ sub: String(userId) }, secret, { expiresIn: "7d" });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.verify(token, secret);
}

/**
 * Reads JWT from httpOnly cookie (preferred) or Authorization: Bearer header.
 */
async function requireAuth(req, res, next) {
  try {
    let token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.slice(7);
    }
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }
    req.user = user;
    req.userId = user._id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

module.exports = {
  requireAuth,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  COOKIE_NAME,
};
