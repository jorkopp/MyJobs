const { validationResult } = require("express-validator");
const { User, ROLE_CATEGORIES, INDUSTRIES } = require("../models/User");
const { sanitizePlainText } = require("../utils/sanitize");

function getProfile(req, res) {
  const u = req.user;
  res.json({
    profile: u.profile,
    email: u.email,
  });
}

async function updateProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const u = await User.findById(req.userId);
    if (!u) return res.status(404).json({ error: "User not found" });

    const {
      resumeText,
      roleCategories,
      industry,
      workMode,
      notifyChannel,
      notifyFrequency,
      phoneE164,
      profileComplete,
    } = req.body;

    if (resumeText !== undefined) {
      u.profile.resumeText = sanitizePlainText(resumeText, 100_000);
    }
    if (Array.isArray(roleCategories)) {
      const allowed = new Set(ROLE_CATEGORIES);
      u.profile.roleCategories = roleCategories
        .filter((x) => typeof x === "string" && allowed.has(x))
        .slice(0, 20);
    }
    if (industry !== undefined && INDUSTRIES.includes(industry)) {
      u.profile.industry = industry;
    }
    if (workMode !== undefined) u.profile.workMode = workMode;
    if (notifyChannel !== undefined) u.profile.notifyChannel = notifyChannel;
    if (notifyFrequency !== undefined) u.profile.notifyFrequency = notifyFrequency;
    if (phoneE164 !== undefined) {
      u.profile.phoneE164 = sanitizePlainText(phoneE164, 32);
    }
    if (typeof profileComplete === "boolean") {
      u.profile.profileComplete = profileComplete;
    }

    await u.save();
    res.json({
      profile: u.profile,
      email: u.email,
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { getProfile, updateProfile };
