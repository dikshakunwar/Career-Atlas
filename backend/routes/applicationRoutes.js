const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect, recruiterOnly } = require("../middleware/authMiddleware");

router.post("/", protect, applyForJob);
router.get("/:jobId", protect, recruiterOnly, getApplicants);
router.put("/:id", protect, recruiterOnly, updateApplicationStatus);
module.exports = router;
