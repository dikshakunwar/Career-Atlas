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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500] max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        {formData.resume && (
          <div className="mb-5 text-sm">
            <p className="font-medium mb-1">Current Resume</p>

            <a
              href={`http://localhost:3000/uploads/resumes/${formData.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-950 hover:underline"
            >
              View Resume
            </a>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">College</label>
            <input
              type="text"
              name="college"
              placeholder="Enter college name"
              value={formData.college}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                placeholder="B.Tech CSE"
                value={formData.degree}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                placeholder="2027"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Experience
            </label>
            <input
              type="text"
              name="experience"
              placeholder="2 Years"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">GitHub</label>
            <input
              type="text"
              name="github"
              placeholder="https://github.com/username"
              value={formData.github}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Portfolio
            </label>
            <input
              type="text"
              name="portfolio"
              placeholder="https://portfolio.com"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResume}
              className="w-full text-sm border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
