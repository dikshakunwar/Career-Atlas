import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    state: "",
    country: "India",
    salary: "",
    experience: "",
    skills: "",
    jobType: "Full-Time",
  });

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await API.get("/jobs/myjobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setJobs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyJobs();
  }, []);

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put(
        `/jobs/${editingJob._id}`,
        {
          ...editData,
          skills: editData.skills.split(",").map((skill) => skill.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setJobs(jobs.map((job) => (job._id === editingJob._id ? res.data : job)));

      setEditingJob(null);

      alert("Job updated successfully");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setJobs(jobs.filter((job) => job._id !== id));

      alert("Job deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to delete job");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Recruiter Dashboard</h1>

      <button
        onClick={() => navigate("/map?mode=post")}
        style={{
          padding: "10px 20px",
          marginBottom: "25px",
        }}
      >
        Post New Job
      </button>

      <h2>My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Location:</strong> {job.location}, {job.state}
            </p>

            <p>
              <strong>Salary:</strong> ₹{job.salary}
            </p>

            <button>View Applicants</button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setEditingJob(job);

                setEditData({
                  title: job.title,
                  company: job.company,
                  description: job.description,
                  location: job.location,
                  state: job.state,
                  country: job.country,
                  salary: job.salary,
                  experience: job.experience,
                  skills: job.skills.join(", "),
                  jobType: job.jobType,
                });
              }}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(job._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {editingJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "25px",
              borderRadius: "10px",
            }}
          >
            <h2>Edit Job</h2>

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={editData.title}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={editData.company}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <textarea
              name="description"
              rows="4"
              placeholder="Description"
              value={editData.description}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={editData.location}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={editData.state}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={editData.salary}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={editData.experience}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="skills"
              placeholder="Skills"
              value={editData.skills}
              onChange={handleEditChange}
            />

            <br />
            <br />

            <select
              name="jobType"
              value={editData.jobType}
              onChange={handleEditChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <br />
            <br />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button onClick={handleUpdate}>Update Job</button>

              <button onClick={() => setEditingJob(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
