const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.phone = req.body.phone;
    user.college = req.body.college;
    user.degree = req.body.degree;
    user.graduationYear = req.body.graduationYear;

    user.skills = req.body.skills
      ? req.body.skills.split(",").map((skill) => skill.trim())
      : [];

    user.experience = req.body.experience;
    user.linkedin = req.body.linkedin;
    user.github = req.body.github;
    user.portfolio = req.body.portfolio;

    if (req.file) {
      user.resume = req.file.filename;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  updateProfile,
  getProfile,
};
