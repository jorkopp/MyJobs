const { Router } = require("express");
const { body } = require("express-validator");
const { register, login, googleLogin, logout, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

const emailCheck = body("email").isEmail().normalizeEmail().isLength({ max: 320 });
const passwordCheck = body("password")
  .isString()
  .isLength({ min: 8, max: 128 })
  .matches(/[A-Za-z]/)
  .matches(/[0-9]/);

router.post("/register", authLimiter, emailCheck, passwordCheck, register);
router.post("/login", authLimiter, emailCheck, body("password").isString().isLength({ min: 1 }), login);
router.post(
  "/google",
  authLimiter,
  body("idToken").isString().isLength({ min: 1 }),
  googleLogin
);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

module.exports = router;
