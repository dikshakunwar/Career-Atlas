import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Briefcase, MapPinned, LayoutDashboard, LogOut } from "lucide-react";

function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4">
        {" "}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors duration-200"
        >
          CareerAtlas
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm font-medium order-3 w-full lg:order-none lg:w-auto">
          {" "}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `pb-1 transition-all duration-200 font-medium hover:scale-105 ${
                isActive
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `flex items-center gap-1 pb-1 transition-all duration-200 font-medium hover:scale-105 ${
                isActive
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-600"
              }`
            }
          >
            <MapPinned size={18} />
            Jobs
          </NavLink>
          {token && user?.role === "recruiter" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 pb-1 transition-all duration-200 font-medium hover:scale-105 ${
                  isActive
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-600"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          )}
          {token && user?.role === "user" && (
            <NavLink
              to="/candidate-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 pb-1 transition-all duration-200 font-medium hover:scale-105 ${
                  isActive
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-600"
                }`
              }
            >
              <Briefcase size={18} />
              My Applications
            </NavLink>
          )}
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {" "}
          {token && (
            <span className="hidden sm:block text-sm text-gray-600">
              {" "}
              Hi, <span className="font-semibold">{user?.name}</span>
            </span>
          )}
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-900 bg-gray-900 text-white hover:bg-black transition-all"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
