import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        Find Jobs Across the World 🌍
      </h1>

      <p
        style={{
          maxWidth: "700px",
          fontSize: "18px",
          marginBottom: "30px",
        }}
      >
        Explore jobs visually on an interactive map. Zoom into countries,
        states, and cities to discover opportunities exactly where they are
        located.
      </p>

      <Link to="/map">
        <button
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Explore Jobs
        </button>
      </Link>
    </div>
  );
}

export default Home;
