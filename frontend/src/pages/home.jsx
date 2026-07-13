import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-[3px] sm:tracking-[5px]">
            Welcome to CareerAtlas
          </p>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Connecting Talent
            <br />
            With Opportunity
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto px-2">
            Discover verified job opportunities from trusted companies and take
            the next step in your professional journey.
          </p>

          {/* Search */}

          <div className="mt-12 flex justify-center">
            <div className="bg-white shadow-lg rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 px-4 sm:px-5 py-4 sm:py-3 w-full max-w-xl">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="flex-1 outline-none px-2 sm:px-4 py-2 text-sm sm:text-base text-gray-700"
              />
              <button
                onClick={() => navigate("/map")}
                className="w-full sm:w-auto bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition"
              >
                Search
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/map")}
            className="mt-8 sm:mt-10 inline-flex items-center gap-2 text-sm sm:text-base text-gray-900 font-medium hover:gap-4 transition-all"
          >
            Browse Jobs
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
