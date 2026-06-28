const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiter: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email",
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
};
