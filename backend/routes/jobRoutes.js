const express = require("express");
const router = express.Router();

const { protect, recruiterOnly } = require("../middleware/authMiddleware");
const { createJob, getAllJobs } = require("../controllers/jobController");

router.post("/", protect, recruiterOnly, createJob);

router.get("/", getAllJobs);

module.exports = router;
