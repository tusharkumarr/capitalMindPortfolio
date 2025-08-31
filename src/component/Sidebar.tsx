import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaChartPie, 
  FaFlask, 
  FaSlack, 
  FaGift, 
  FaUser, 
  FaUserFriends 
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">capitalmind</h1>
      <nav>
        <ul>
          <li>
            <Link to="/"><FaHome className="icon" /> Home</Link>
          </li>
          <li>
            <Link to="/portfolio"><FaChartPie className="icon" /> Portfolios</Link>
          </li>
          <li>
            <a href="#"><FaFlask className="icon" /> Experimentals</a>
          </li>
          <li>
            <a href="#"><FaSlack className="icon" /> Slack Archives</a>
          </li>
          <li>
            <a href="#"><FaUserFriends className="icon" /> Refer a friend</a>
          </li>
          <li>
            <a href="#"><FaGift className="icon" /> Gift a subscription</a>
          </li>
          <li>
            <a href="#"><FaUser className="icon" /> Account</a>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <img 
          src="/profile.jpg"
          alt="Profile" 
          className="profile-image" 
        />
        <span className="profile-name">Tushar Sharma</span>
      </div>
    </aside>
  );
}
