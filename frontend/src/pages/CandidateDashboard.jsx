import { useEffect, useState } from "react";
import API from "../services/api";
import EditProfileModal from "../components/EditProfileModal";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/myapplications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setApplications(res.data);
      } catch (err) {
        console.log(err);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Applications */}

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">
                My Applications
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Track your applications and profile
              </p>
            </div>

            <button
              onClick={() => setShowSideMenu(true)}
              className="lg:hidden border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="mt-8">
            {applications.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                You haven't applied to any jobs yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {applications
                  .filter((application) => application.job)
                  .map((application) => (
                    <div
                      key={application._id}
                      onClick={() => navigate(`/job/${application.job._id}`)}
                      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-semibold text-base leading-6">
                          {application.job.title}
                        </h3>

                        <span
                          className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${getStatusStyle(
                            application.status,
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        {application.job.company}
                      </p>

                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <p>📍 {application.job.location}</p>
                        <p>₹ {application.job.salary}</p>
                        <p>{application.job.jobType}</p>
                      </div>

                      <p className="mt-5 text-xs text-gray-400">
                        Applied on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {/* Desktop Profile */}

        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-4xl">
                👤
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user")).name
                  : ""}
              </h2>

              <p className="text-sm text-gray-500">Candidate</p>
            </div>

            <div className="border-t my-6"></div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>

                <p className="font-medium break-all">
                  {localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).email
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Resume</p>

                <p className="font-medium">Uploaded ✓</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full mt-8 border border-gray-900 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Profile Drawer */}

      {showSideMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowSideMenu(false)}
          />

          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">My Profile</h2>

              <button
                onClick={() => setShowSideMenu(false)}
                className="text-2xl text-gray-500 hover:text-black transition"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col items-center mt-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-4xl">
                👤
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user")).name
                  : ""}
              </h3>

              <p className="text-sm text-gray-500">Candidate</p>
            </div>

            <div className="border-t my-6"></div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>

                <p className="break-all">
                  {localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user")).email
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Resume</p>

                <p>Uploaded ✓</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSideMenu(false);
                setShowProfileModal(true);
              }}
              className="w-full mt-8 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-black transition"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}

      <EditProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default CandidateDashboard;
