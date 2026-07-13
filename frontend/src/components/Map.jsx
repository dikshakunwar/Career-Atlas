import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const selectedMarker = useRef(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isPostMode = searchParams.get("mode") === "post";
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    state: "",
    country: "India",
    salary: "",
    experience: "",
    skills: "",
    jobType: "Full-Time",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/jobs",
        {
          ...jobData,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          skills: jobData.skills.split(",").map((skill) => skill.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Job Posted Successfully");

      await fetchJobs();

      setShowJobForm(false);
      navigate("/map", { replace: true });
      setSelectedLocation(null);

      // Remove the red marker from the map
      if (selectedMarker.current) {
        selectedMarker.current.remove();
        selectedMarker.current = null;
      }

      setJobData({
        title: "",
        company: "",
        salary: "",
        description: "",
        location: "",
        state: "",
        experience: "",
        skills: "",
        jobType: "Full-Time",
      });
    } catch (err) {
      console.log(err);
      alert("Failed to post job");
    }
  };
  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    fetchJobs();
  }, []);
  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e) => {
      if (!isPostMode) return;

      const { lng, lat } = e.lngLat;

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
      });

      setShowJobForm(true);

      if (selectedMarker.current) {
        selectedMarker.current.remove();
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div>
        <h3>Selected Location</h3>
        <button id="post-job-btn">Post Job Here</button>
      </div>
    `);

      selectedMarker.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      selectedMarker.current.togglePopup();
    };

    map.current.on("click", handleMapClick);

    return () => {
      map.current.off("click", handleMapClick);
    };
  }, [isPostMode]);
  useEffect(() => {
    console.log("Selected Location:", selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    if (!map.current) return;
    console.log(jobs);
    jobs.forEach((job) => {
      const popup = new mapboxgl.Popup({
        offset: 18,
        maxWidth: "230px",
      }).setHTML(`
<div style="font-family:Inter,sans-serif;">
  <h3 style="margin:0;font-size:16px;font-weight:600;">${job.title}</h3>

  <p style="margin:4px 0 10px;color:#6b7280;font-size:13px;">
    ${job.company}
  </p>

  <p style="margin:0;font-size:13px;">📍 ${job.location}</p>

  <p style="margin:6px 0 12px;font-size:13px;">₹${job.salary}</p>

  <a
    href="/job/${job._id}"
    style="
      display:block;
      text-align:center;
      text-decoration:none;
      padding:6px;
      border-radius:8px;
      background:#111827;
      color:white;
      font-size:13px;
      font-weight:500;
    "
  >
    View Details
  </a>
</div>
`);
      new mapboxgl.Marker()
        .setLngLat([job.longitude, job.latitude])
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [jobs]);
  return (
    <>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "90vh",
        }}
      />

      {showJobForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-screen overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-semibold">Post New Job</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowJobForm(false);
                  navigate("/map", { replace: true });
                }}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Google"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="800000"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows="5"
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Write job description..."
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={jobData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={jobData.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="2 Years"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={jobData.skills}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false);
                    navigate("/map", { replace: true });
                  }}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-black transition"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Map;
