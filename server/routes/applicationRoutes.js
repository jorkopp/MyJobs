const { Router } = require("express");
const { body, param } = require("express-validator");
const { list, create, update, remove } = require("../controllers/applicationController");
const { requireAuth } = require("../middleware/auth");
const { applicationStatusEnum } = require("../models/Application");

const router = Router();
router.use(requireAuth);

router.get("/", list);

router.post(
  "/",
  body("externalJobId").isString().trim().isLength({ min: 1, max: 120 }),
  body("title").isString().trim().isLength({ min: 1, max: 500 }),
  body("company").optional().isString().isLength({ max: 300 }),
  body("jobUrl").optional().isString().isLength({ max: 2000 }),
  body("category").optional().isString().isLength({ max: 120 }),
  body("source").optional().isString().isLength({ max: 40 }),
  body("status").optional().isIn(applicationStatusEnum),
  body("notes").optional().isString().isLength({ max: 10000 }),
  create
);

router.patch(
  "/:id",
  param("id").isMongoId(),
  body("status").optional().isIn(applicationStatusEnum),
  body("notes").optional().isString().isLength({ max: 10000 }),
  body("title").optional().isString().isLength({ max: 500 }),
  body("company").optional().isString().isLength({ max: 300 }),
  update
);

router.delete("/:id", param("id").isMongoId(), remove);

module.exports = router;
