import { useEffect, useState } from "react";
import API from "../services/api";

function EditProfileModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    phone: "",
    college: "",
    degree: "",
    graduationYear: "",
    skills: "",
    experience: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
  });

  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (show) {
      fetchProfile();
    }
  }, [show]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFormData({
        phone: res.data.phone || "",
        college: res.data.college || "",
        degree: res.data.degree || "",
        graduationYear: res.data.graduationYear || "",
        skills: res.data.skills?.join(", ") || "",
        experience: res.data.experience || "",
        linkedin: res.data.linkedin || "",
        github: res.data.github || "",
        portfolio: res.data.portfolio || "",
        resume: res.data.resume || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResume = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (resume) {
        data.append("resume", resume);
      }

      await API.put("/users/profile", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated Successfully");

      onClose();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "10px",
          padding: "25px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "15px",
            top: "10px",
            border: "none",
            background: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2>Edit Profile</h2>
        {formData.resume && (
          <div style={{ marginBottom: "20px" }}>
            <strong>Current Resume:</strong>

            <br />

            <a
              href={`http://localhost:3000/uploads/resumes/${formData.resume}`}
              target="_blank"
              rel="noreferrer"
            >
              View Current Resume
            </a>
          </div>
        )}
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="graduationYear"
          placeholder="Graduation Year"
          value={formData.graduationYear}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="linkedin"
          placeholder="LinkedIn"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="github"
          placeholder="GitHub"
          value={formData.github}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          name="portfolio"
          placeholder="Portfolio"
          value={formData.portfolio}
          onChange={handleChange}
        />

        <br />
        <br />

        <input type="file" accept=".pdf" onChange={handleResume} />

        <br />
        <br />

        <button onClick={handleSave}>Save Profile</button>

        <button
          onClick={onClose}
          style={{
            marginLeft: "10px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProfileModal;
