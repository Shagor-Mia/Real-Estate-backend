const express = require("express");
const {
  createProperty,
  getProperties,
} = require("../controllers/propertyController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/", authenticate, createProperty);
router.get("/", getProperties);
module.exports = router;
