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
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [showCandidateProfile, setShowCandidateProfile] = useState(false);
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
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status } : app,
        ),
      );
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
    if (
      !editData.title ||
      !editData.company ||
      !editData.location ||
      !editData.state ||
      !editData.salary
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await API.put(
        `/jobs/${editingJob._id}`,
        {
          ...editData,
          salary: Number(editData.salary),
          skills: editData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === editingJob._id ? res.data : job)),
      );

      setEditingJob(null);

      alert("Job updated successfully.");
    } catch (err) {
      console.log(err.response?.data || err);

      alert(err.response?.data?.message || "Failed to update job.");
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

              <div className="flex gap-1 mt-5 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewApplicants(job._id)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg py-2 text-xs hover:bg-gray-100 transition"
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
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-xs hover:bg-gray-100 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex-1 border border-red-300 text-red-600 rounded-lg py-2 text-xs hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-4 right-5 text-xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold">Edit Job</h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Update your job posting details.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={editData.company}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={editData.state}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Salary
                </label>

                <input
                  type="number"
                  name="salary"
                  value={editData.salary}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Experience
                </label>

                <input
                  type="text"
                  name="experience"
                  value={editData.experience}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Skills (comma separated)
                </label>

                <input
                  type="text"
                  name="skills"
                  value={editData.skills}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={editData.jobType}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingJob(null)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showApplicants && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl max-h-[85vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowApplicants(false)}
              className="absolute top-4 right-5 text-xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold">Applicants</h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Manage candidates who applied for this job.
            </p>

            {applicants.length === 0 ? (
              <div className="border border-gray-200 rounded-xl p-10 text-center text-gray-500 text-sm">
                No applicants yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition overflow-hidden"
                  >
                    <div className="flex  justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">
                          {app.applicant.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {app.applicant.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full ${
                          app.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={async () => {
                          try {
                            const res = await API.get(
                              `/users/${app.applicant._id}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              },
                            );

                            setCandidate(res.data);
                            setSelectedCandidateId(app.applicant._id);
                            setShowCandidateProfile(true);
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded-lg py-2 text-xs hover:bg-gray-100 transition"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(app._id, "Accepted")}
                        className="flex-1 border border-gray-300 rounded-md py-1.5 text-[11px] hover:bg-gray-100 transition"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(app._id, "Rejected")}
                        className="flex-1 border border-gray-300 rounded-md py-1.5 text-[11px] hover:bg-gray-100 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showCandidateProfile && candidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-60">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative">
            <button
              onClick={() => setShowCandidateProfile(false)}
              className="absolute right-5 top-4 text-xl"
            >
              ×
            </button>

            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Candidate Profile</h2>
              <p className="text-sm text-gray-500">Review applicant details</p>
            </div>

            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              <div className="border rounded-xl p-5 mb-5">
                <h3 className="text-sm font-semibold mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Name</p>
                    <p>{candidate.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p>{candidate.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p>{candidate.phone || "Not Added"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Experience</p>
                    <p>{candidate.experience || "Fresher"}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl p-5 mb-5">
                <h3 className="text-sm font-semibold mb-4">Education</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">College</p>
                    <p>{candidate.college || "Not Added"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Degree</p>
                    <p>{candidate.degree || "Not Added"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs">Graduation Year</p>
                    <p>{candidate.graduationYear || "Not Added"}</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-xl p-5 mb-5">
                <h3 className="text-sm font-semibold mb-4">Skills</h3>

                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.length ? (
                    candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added.</p>
                  )}
                </div>
              </div>

              <div className="border rounded-xl p-5 mb-5">
                <h3 className="text-sm font-semibold mb-4">Links</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>LinkedIn</span>

                    {candidate.linkedin ? (
                      <a
                        href={candidate.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Added</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>GitHub</span>

                    {candidate.github ? (
                      <a
                        href={candidate.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Added</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>Portfolio</span>

                    {candidate.portfolio ? (
                      <a
                        href={candidate.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Added</span>
                    )}
                  </div>
                </div>
              </div>
              {candidate.resume && (
                <div className="border rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Resume</h3>

                  <a
                    href={`http://localhost:3000/uploads/resumes/${candidate.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
