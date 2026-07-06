const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "recruiter"],
      default: "user",
    },
    phone: {
      type: String,
    },

    college: {
      type: String,
    },

    degree: {
      type: String,
    },

    graduationYear: {
      type: Number,
    },

    skills: [
      {
        type: String,
      },
    ],

    experience: {
      type: String,
    },

    linkedin: {
      type: String,
    },

    github: {
      type: String,
    },

    portfolio: {
      type: String,
    },

    resume: {
      type: String,
    },

    profilePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
