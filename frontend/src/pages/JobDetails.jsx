import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
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

  if (!job) {
    return <h2>Loading...</h2>;
  }
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
  return (
    <div style={{ padding: "30px" }}>
      <h1>{job.title}</h1>

      <h3>{job.company}</h3>

      <p>{job.description}</p>

      <p>
        <strong>Location:</strong> {job.location}, {job.state}, {job.country}
      </p>

      <p>
        <strong>Salary:</strong> ₹{job.salary}
      </p>

      <p>
        <strong>Experience:</strong> {job.experience}
      </p>

      <p>
        <strong>Job Type:</strong> {job.jobType}
      </p>

      <p>
        <strong>Skills:</strong> {job.skills.join(", ")}
      </p>

      <button onClick={handleApply}>Apply Now</button>
    </div>
  );
}

export default JobDetails;
