import { useEffect, useState } from "react";
import API from "../services/api";
import EditProfileModal from "../components/EditProfileModal";
import { useNavigate } from "react-router-dom";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/myapplications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Applications API Response:", res.data);

        setApplications(res.data);
      } catch (err) {
        console.log("Error:", err.response);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <h1 className="text-3xl font-semibold">My Applications</h1>

          <p className="text-gray-500 text-sm mt-1 mb-6">
            Track your applications and profile
          </p>

          {applications.length === 0 ? (
            <p className="text-gray-500">
              You haven't applied to any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {applications
                .filter((application) => application.job)
                .map((application) => (
                  <div
                    key={application._id}
                    onClick={() => navigate(`/job/${application.job._id}`)}
                    className=" bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm leading-5">
                        {application.job.title}
                      </h3>

                      <span
                        className={`text-[10px] px-2 py-1 rounded-full ${getStatusStyle(
                          application.status,
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {application.job.company}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p>📍 {application.job.location}</p>

                      <p>₹ {application.job.salary}</p>

                      <p>{application.job.jobType}</p>
                    </div>

                    <p className="mt-4 text-[11px] text-gray-400">
                      Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="col-span-4 relative">
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                👤
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user")).name
                  : ""}
              </h2>

              <p className="text-gray-500 text-sm">Candidate</p>
            </div>

            <div className="border-t my-5"></div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Email</span>

                <p className="font-medium">
                  {localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).email
                    : ""}
                </p>
              </div>

              <div>
                <span className="text-gray-500">Resume</span>

                <p className="font-medium">Uploaded ✓</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-6 w-full border border-gray-900 rounded-lg py-2 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default CandidateDashboard;
