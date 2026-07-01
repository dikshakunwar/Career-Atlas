const Application = require("../models/Application");
const getApplicants = async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("applicant", "name email")
      .populate("job", "title");

    res.json(applications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }, // replaces new: true
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  applyForJob,
  getApplicants,
  updateApplicationStatus,
};
