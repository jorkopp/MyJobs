const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { User } = require("../models/User");
const { signToken, setAuthCookie, clearAuthCookie } = require("../middleware/auth");
const { verifyGoogleIdToken } = require("../config/firebaseAdmin");

function toUserResponse(user) {
  return {
    id: user._id,
    email: user.email,
    profile: user.profile,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
    });
    const token = signToken(user._id);
    setAuthCookie(res, token);
    return res.status(201).json({
      user: toUserResponse(user),
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+passwordHash"
    );
    if (user && !user.passwordHash) {
      return res
        .status(400)
        .json({ error: "This account uses Google sign-in. Continue with Google." });
    }
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user._id);
    setAuthCookie(res, token);
    return res.json({
      user: toUserResponse(user),
    });
  } catch (e) {
    next(e);
  }
}

async function googleLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { idToken } = req.body;
    const payload = await verifyGoogleIdToken(idToken);
    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ error: "Google account email is not verified" });
    }

    const email = payload.email.toLowerCase().trim();
    let user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      user = await User.create({
        email,
        authProvider: "google",
      });
    } else if (user.passwordHash && user.authProvider !== "google") {
      return res.status(409).json({
        error: "An account with this email already exists. Sign in with email/password.",
      });
    } else if (user.authProvider !== "google") {
      user.authProvider = "google";
      await user.save();
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);
    return res.json({ user: toUserResponse(user) });
  } catch (e) {
    if (e.code === "auth/id-token-expired" || e.code === "auth/invalid-id-token") {
      return res.status(401).json({ error: "Google sign-in token is invalid or expired" });
    }
    next(e);
  }
}

async function logout(req, res) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

async function me(req, res) {
  const u = await User.findById(req.userId).select("-passwordHash");
  res.json({
    user: {
      id: u._id,
      email: u.email,
      profile: u.profile,
      updatedAt: u.updatedAt,
    },
  });
}

module.exports = { register, login, googleLogin, logout, me };
