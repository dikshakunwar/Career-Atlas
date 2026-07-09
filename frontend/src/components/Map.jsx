import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../services/api";
import { useSearchParams } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const selectedMarker = useRef(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [searchParams] = useSearchParams();
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
      await API.post(
        "/jobs",
        {
          ...jobData,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          skills: jobData.skills.split(","),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Job Posted Successfully");

      setShowJobForm(false);

      window.location.reload();
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

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    map.current.on("click", (e) => {
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
    });

    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);
  useEffect(() => {
    console.log("Selected Location:", selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    if (!map.current) return;
    console.log(jobs);
    jobs.forEach((job) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div>
        <h3>${job.title}</h3>
        <p><strong>${job.company}</strong></p>
        <p>${job.location}, ${job.state}</p>
        <p>₹${job.salary}</p>
        <button onclick="window.location.href='/job/${job._id}'">
          View Details
        </button>
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
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "350px",
            height: "100vh",
            background: "white",
            padding: "20px",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
            overflowY: "auto",
          }}
        >
          <h2>Post New Job</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={jobData.title}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid red",
                marginBottom: "20px",
              }}
            />
            <br />
            <br />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={jobData.company}
              onChange={handleChange}
            />

            <br />
            <br />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={jobData.salary}
              onChange={handleChange}
            />

            <br />
            <br />
            <textarea
              name="description"
              placeholder="Job Description"
              value={jobData.description}
              onChange={handleChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="location"
              placeholder="City"
              value={jobData.location}
              onChange={handleChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={jobData.state}
              onChange={handleChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="experience"
              placeholder="Experience (e.g. 2 Years)"
              value={jobData.experience}
              onChange={handleChange}
            />

            <br />
            <br />

            <input
              type="text"
              name="skills"
              placeholder="Skills (React, Node.js, MongoDB)"
              value={jobData.skills}
              onChange={handleChange}
            />

            <br />
            <br />

            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <br />
            <br />

            <button type="submit">Post Job</button>
          </form>

          <br />

          <button onClick={() => setShowJobForm(false)}>Close</button>
        </div>
      )}
    </>
  );
}

export default Map;
