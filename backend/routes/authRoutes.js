const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");
const { registerUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;
