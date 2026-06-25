const getJobs = (req, res) => {
  res.json([
    {
      id: 1,
      title: "Frontend Developer",
      location: "Delhi",
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "Bangalore",
    },
  ]);
};

module.exports = { getJobs };
