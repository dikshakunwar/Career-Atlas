import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CandidateProfile() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await API.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCandidate(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCandidate();
  }, [id]);

  if (!candidate) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h1>{candidate.name}</h1>

      <p>
        <strong>Email:</strong> {candidate.email}
      </p>

      <p>
        <strong>Phone:</strong> {candidate.phone || "Not Added"}
      </p>

      <p>
        <strong>College:</strong> {candidate.college || "Not Added"}
      </p>

      <p>
        <strong>Degree:</strong> {candidate.degree || "Not Added"}
      </p>

      <p>
        <strong>Graduation Year:</strong>{" "}
        {candidate.graduationYear || "Not Added"}
      </p>

      <p>
        <strong>Experience:</strong> {candidate.experience || "Not Added"}
      </p>

      <p>
        <strong>Skills:</strong>{" "}
        {candidate.skills?.length ? candidate.skills.join(", ") : "Not Added"}
      </p>

      <p>
        <strong>LinkedIn:</strong>{" "}
        {candidate.linkedin ? (
          <a href={candidate.linkedin} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          "Not Added"
        )}
      </p>

      <p>
        <strong>GitHub:</strong>{" "}
        {candidate.github ? (
          <a href={candidate.github} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          "Not Added"
        )}
      </p>

      <p>
        <strong>Portfolio:</strong>{" "}
        {candidate.portfolio ? (
          <a href={candidate.portfolio} target="_blank" rel="noreferrer">
            Open
          </a>
        ) : (
          "Not Added"
        )}
      </p>

      {candidate.resume && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={`http://localhost:3000/uploads/resumes/${candidate.resume}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 Download Resume
          </a>
        </div>
      )}
    </div>
  );
}

export default CandidateProfile;
