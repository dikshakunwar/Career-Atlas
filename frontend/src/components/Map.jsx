import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../services/api";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const selectedMarker = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
      });

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
    map.current.on("load", () => {
      map.current.on("click", (e) => {
        console.log("Map clicked");
        console.log(e.lngLat);

        setSelectedLocation({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      });
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
