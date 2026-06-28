import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../services/api";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937],
      zoom: 4,
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
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "90vh",
      }}
    />
  );
}
export default Map;
