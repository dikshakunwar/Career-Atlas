import { useEffect, useState } from "react";
import API from "../services/api";
import EditProfileModal from "../components/EditProfileModal";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Applications</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowProfileModal(true)}>Edit Profile</button>
      </div>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        applications
          .filter((application) => application.job)
          .map((application) => (
            <div
              key={application._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h2>{application.job.title}</h2>

              <h4>{application.job.company}</h4>

              <p>
                <strong>Location:</strong> {application.job.location},{" "}
                {application.job.state}
              </p>

              <p>
                <strong>Salary:</strong> ₹{application.job.salary}
              </p>

              <p>
                <strong>Status:</strong> {application.status}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
      )}
      <EditProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default CandidateDashboard;
