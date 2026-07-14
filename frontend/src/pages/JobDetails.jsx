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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Job Header */}

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {job.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {job.company}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] sm:text-sm text-gray-500 mt-4">
              <span>📍 {job.location}</span>

              <span>💰 ₹ {job.salary}</span>

              <span>💼 {job.jobType}</span>

              <span>⭐ {job.experience}</span>
            </div>
          </div>

          {user?.role === "user" && (
            <button
              onClick={handleApply}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-white transition"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Section */}

        <div className="lg:col-span-8 space-y-5">
          {/* Description */}

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Description
            </h2>

            <div className="text-sm leading-7 text-gray-700 whitespace-pre-wrap">
              {job.description.split("\n").map((line, index) => {
                const headings = [
                  "Description",
                  "Key Responsibilities",
                  "Responsibilities",
                  "Requirements",
                  "Required Skills",
                  "Qualifications",
                  "Eligibility",
                  "Employee Benefit",
                  "Perks",
                  "About the Company",
                  "About Company",
                  "Job Description",
                ];

                const matchedHeading = headings.find((heading) =>
                  line.trim().toLowerCase().startsWith(heading.toLowerCase()),
                );

                return (
                  <div key={index}>
                    {matchedHeading ? <strong>{line}</strong> : line}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Required Skills
            </h2>

            <p className="text-sm text-gray-700 leading-7">
              {Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}
            </p>
          </div>
        </div>

        {/* Overview */}

        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-base sm:text-lg font-semibold mb-5">
              Job Overview
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Company</span>
                <span className="font-medium text-right break-words">
                  {job.company}
                </span>
              </div>

              <div className="border-t"></div>

              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Location</span>
                <span className="font-medium text-right break-words">
                  {job.location}
                </span>
              </div>

              <div className="border-t"></div>

              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Salary</span>
                <span className="font-medium text-right">₹ {job.salary}</span>
              </div>

              <div className="border-t"></div>

              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Experience</span>
                <span className="font-medium text-right">{job.experience}</span>
              </div>

              <div className="border-t"></div>

              <div className="flex justify-between items-start gap-4 text-sm">
                <span className="text-gray-500 shrink-0">Job Type</span>
                <span className="font-medium text-right">{job.jobType}</span>
              </div>
            </div>

            {user?.role === "user" && (
              <button
                onClick={handleApply}
                className="mt-6 w-full bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-black transition sm:hidden"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
