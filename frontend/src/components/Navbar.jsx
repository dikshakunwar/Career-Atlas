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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 whitespace-nowrap"
            >
              CareerAtlas
            </Link>

            {/* Mobile User */}
            {token && (
              <div className="flex items-center gap-2 lg:hidden">
                <span className="text-xs text-gray-600">
                  Hi, <span className="font-semibold">{user?.name}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2 py-1 text-xs border rounded-lg hover:bg-gray-100"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Center */}
          <div className="flex justify-center flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-black pb-1 text-black"
                  : "pb-1 text-gray-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `flex items-center gap-1 ${
                  isActive
                    ? "border-b-2 border-black pb-1 text-black"
                    : "pb-1 text-gray-600"
                }`
              }
            >
              <MapPinned size={16} />
              Jobs
            </NavLink>

            {token && user?.role === "recruiter" && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1 ${
                    isActive
                      ? "border-b-2 border-black pb-1 text-black"
                      : "pb-1 text-gray-600"
                  }`
                }
              >
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
            )}

            {token && user?.role === "user" && (
              <NavLink
                to="/candidate-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? "border-b-2 border-black pb-1 text-black"
                      : "pb-1 text-gray-600"
                  }`
                }
              >
                <Briefcase size={16} />
                My Applications
              </NavLink>
            )}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            {token && (
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Hi, <span className="font-semibold">{user?.name}</span>
              </span>
            )}

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
