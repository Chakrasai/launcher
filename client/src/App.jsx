import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Listening from "./components/Listening";
import Enroll from "./components/Enroll";
import Login from "./components/Login";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Landing" element={<Landing />} />
      <Route path="/listening" element={<Listening />} />
      <Route path="/enroll" element={<Enroll />} />
    </Routes>
  );
}

export default App;
