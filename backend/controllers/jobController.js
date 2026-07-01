const Job = require("../models/Job");

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const createJob = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const job = await Job.create({
      ...req.body,
      recruiter: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);

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
  getMyJobs,
  deleteJob,
  updateJob,
};
