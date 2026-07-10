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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-full max-w-xl max-h-[82vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Keep your profile updated for recruiters.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {formData.resume && (
            <div className="mb-6 rounded-xl border bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Current Resume</p>

                <a
                  href={`http://localhost:3000/uploads/resumes/${formData.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline"
                >
                  View Resume
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="college"
              placeholder="College"
              value={formData.college}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="degree"
              placeholder="Degree"
              value={formData.degree}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="graduationYear"
              placeholder="Graduation Year"
              value={formData.graduationYear}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="skills"
              placeholder="Skills"
              value={formData.skills}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />

            <input
              name="github"
              placeholder="GitHub URL"
              value={formData.github}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <input
            name="portfolio"
            placeholder="Portfolio Website"
            value={formData.portfolio}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm outline-none focus:border-black w-full mt-4"
          />

          <div className="mt-6">
            <label className="block text-xs text-gray-500 mb-1">
              Upload New Resume
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={handleResume}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 border-t pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
