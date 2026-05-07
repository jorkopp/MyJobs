const { Router } = require("express");
const { query } = require("express-validator");
const { search } = require("../controllers/jobsController");
const { requireAuth } = require("../middleware/auth");

const router = Router();
router.use(requireAuth);

router.get(
  "/search",
  query("q").optional().isString().isLength({ max: 120 }),
  query("category").optional().isString().isLength({ max: 80 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  search
);

module.exports = router;
