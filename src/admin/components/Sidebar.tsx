import { Link } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaVideo,
  FaUsers,
  FaClipboardCheck,
  FaCertificate,
  FaMoneyBill,
  FaBell,
  FaUser,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">

      <h2 className="logo">YSCMT LMS</h2>

      <nav>

        <Link to="/admin">
          <FaHome /> Dashboard
        </Link>

        <Link to="/courses">
          <FaBook /> Courses
        </Link>

        <Link to="/lessons">
          <FaVideo /> Lessons
        </Link>

        <Link to="/students">
          <FaUsers /> Students
        </Link>

        <Link to="/quiz-attempts">
          <FaClipboardCheck /> Quiz Attempts
        </Link>

        <Link to="/certificates">
          <FaCertificate /> Certificates
        </Link>

        <Link to="/payments">
          <FaMoneyBill /> Payments
        </Link>

        <Link to="/notifications">
          <FaBell /> Notifications
        </Link>

        <Link to="/profile">
          <FaUser /> Profile
        </Link>

        <Link to="/settings">
          <FaCog /> Settings
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;
