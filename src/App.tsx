import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
