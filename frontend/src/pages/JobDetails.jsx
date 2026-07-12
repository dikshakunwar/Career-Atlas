import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function JobDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await API.post(
        "/applications",
        {
          jobId: job._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">{job.title}</h1>

            <p className="text-sm text-gray-600 mt-1">{job.company}</p>

            <div className="flex gap-5 text-xs text-gray-500 mt-3 flex-wrap">
              <span>📍 {job.location}</span>
              <span>💰 ₹ {job.salary}</span>
              <span>💼 {job.jobType}</span>
              <span>⭐ {job.experience}</span>
            </div>
          </div>

          {user?.role === "user" && (
            <button
              onClick={handleApply}
              className="px-5 py-2 border border-gray-900 rounded-lg text-sm hover:bg-gray-900 hover:text-white transition"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mt-5">
        <div className="col-span-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold mb-3">Description</h2>

            <p className="font-normal text-sm whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-5">
            <h2 className="text-base font-semibold mb-3">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-gray-300 rounded-md text-xs hover:bg-gray-900 hover:text-white transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="text-base font-semibold mb-4">Overview</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Company</span>
                <span>{job.company}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span>{job.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Salary</span>
                <span>₹ {job.salary}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Experience</span>
                <span>{job.experience}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Job Type</span>
                <span>{job.jobType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
