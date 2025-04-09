import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CIcon } from "@coreui/icons-react";
import { cilMicrophone } from "@coreui/icons";

const api_url = import.meta.env.VITE_API

function Landing() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleMicClick = () => {
    setIsListening(true);
    navigate("/listening");
  }
  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch(`${api_url}/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const userData = await user.json();
      setUserData(userData);
      console.log(userData);
    };
    fetchUser();
  }, []);
  
  return (
    <>
    <nav className="w-full text-center text-white py-4 bg-gray-800 text-2xl font-semibold shadow-md">
      App Launcher -- {userData?.username || "Guest"}
    </nav>
    <motion.div
    className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    initial={{ opacity: 1 }}
    animate={isListening ? { opacity: 0, y: -50 } : { opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <motion.div
    className="flex items-center w-96 h-48 bg-gray-800 rounded-2xl shadow-lg p-4"
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.02 }}
    >
    <motion.div
    className="flex-1 h-full flex items-center justify-center bg-blue-500 rounded-lg text-lg font-semibold cursor-pointer hover:bg-blue-600 transition"
    whileHover={{ scale: 1.1 }}
    onClick={()=> navigate('/enroll')}
    >
    Enroll Voice & Apps
    </motion.div>

    <div className="w-1 h-full bg-white mx-2"></div>

    <motion.div
    className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleMicClick}

    >
    <CIcon icon={cilMicrophone} size="3xl" />
    </motion.div>
    </motion.div>
  </motion.div>
    </>
  );
}

export default Landing;
