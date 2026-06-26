const express = require("express");
const jobRoutes = require("./routes/jobRoutes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
