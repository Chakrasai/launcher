import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Mic from "./Mic";



function Listening() {
  const navigate = useNavigate();

  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>
      <nav className="w-full text-center text-white py-4 bg-gray-800 text-2xl font-semibold shadow-md">
        App Launcher
      </nav>
      <motion.div
        className="flex flex-col items-center justify-center text-white bg-gray-900 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
            animate={isAnimating ? { scale: [1, 1, 1] } : {}}
            transition={isAnimating ? { repeat: Infinity, duration: 1 } : {}}
            onClick={() => setIsAnimating(!isAnimating)}
          >
            <Mic />
          </motion.div>
        <motion.button
          className="mt-6 px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/landing")}
        >
          Go Back
        </motion.button>
      </motion.div>
    </>
  );
}

export default Listening;
