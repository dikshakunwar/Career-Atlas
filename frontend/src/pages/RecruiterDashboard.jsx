import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
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
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const res = await API.put(
        `/applications/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setApplicants(
        applicants.map((app) => (app._id === applicationId ? res.data : app)),
      );

      alert(`Application ${status}`);
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };
  const handleViewApplicants = async (jobId) => {
    try {
      const res = await API.get(`/applications/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setApplicants(res.data);
      setSelectedJob(jobId);
      setShowApplicants(true);
    } catch (err) {
      console.log(err);
      alert("Failed to load applicants");
    }
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
    <div className="max-w-5xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Recruiter Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your posted jobs and applicants
          </p>
        </div>

        <button
          onClick={() => navigate("/map?mode=post")}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-black transition"
        >
          + Post New Job
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-4">My Jobs</h2>

      {jobs.length === 0 ? (
        <div className="border border-gray-200 rounded-xl bg-white p-8 text-center text-sm text-gray-500">
          No jobs posted yet.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold">{job.title}</h3>

                  <p className="text-xs text-gray-500 mt-1">{job.company}</p>
                </div>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-1 mt-4 text-[11px] text-gray-600">
                <p>📍 {job.location}</p>
                <p>₹ {job.salary}</p>
                <p>{job.jobType}</p>
                <p>{job.experience}</p>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Applicants: <strong>{job.applicantCount || 0}</strong>
                </span>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    className="px-3 py-2 border rounded-lg text-xs hover:bg-gray-100 transition"
                  >
                    Applicants
                  </button>

                  <button
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
                    className="px-3 py-2 border rounded-lg text-xs hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-xs hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      {showApplicants && (
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
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>Applicants</h2>

            {applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              applicants.map((app) => (
                <div
                  key={app._id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <h3>{app.applicant.name}</h3>

                  <p>{app.applicant.email}</p>

                  <p>
                    <strong>Status:</strong> {app.status}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Accepted")}
                    >
                      Accept
                    </button>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleStatusUpdate(app._id, "Rejected")}
                    >
                      Reject
                    </button>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        navigate(`/candidate/${app.applicant._id}`)
                      }
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            )}

            <button onClick={() => setShowApplicants(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
