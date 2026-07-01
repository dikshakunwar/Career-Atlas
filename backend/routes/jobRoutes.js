const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");

const { protect, recruiterOnly } = require("../middleware/authMiddleware");

router.post("/", protect, recruiterOnly, createJob);

router.get("/myjobs", protect, recruiterOnly, getMyJobs);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.delete("/:id", protect, recruiterOnly, deleteJob);

router.put("/:id", protect, recruiterOnly, updateJob);

module.exports = router;
