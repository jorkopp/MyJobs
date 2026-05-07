const { Router } = require("express");
const { body } = require("express-validator");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { requireAuth } = require("../middleware/auth");
const {
  ROLE_CATEGORIES,
  INDUSTRIES,
  workModeEnum,
  notifyChannelEnum,
  notifyFrequencyEnum,
} = require("../models/User");

const router = Router();

router.use(requireAuth);

router.get("/", getProfile);

router.patch(
  "/",
  body("resumeText").optional().isString().isLength({ max: 100000 }),
  body("roleCategories").optional().isArray({ max: 20 }),
  body("roleCategories.*").optional().isIn(ROLE_CATEGORIES),
  body("industry").optional().isIn(INDUSTRIES),
  body("workMode").optional().isIn(workModeEnum),
  body("notifyChannel").optional().isIn(notifyChannelEnum),
  body("notifyFrequency").optional().isIn(notifyFrequencyEnum),
  body("phoneE164").optional().isString().isLength({ max: 32 }),
  body("profileComplete").optional().isBoolean(),
  updateProfile
);

module.exports = router;
