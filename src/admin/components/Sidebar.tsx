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

        <Link to="/admin/courses">
          <FaBook /> Courses
        </Link>

        <Link to="/admin/lessons">
          <FaVideo /> Lessons
        </Link>

        <Link to="/admin/students">
          <FaUsers /> Students
        </Link>

        <Link to="/admin/quizzes">
          <FaClipboardCheck /> Quiz Attempts
        </Link>

        <Link to="/admin/certificates">
          <FaCertificate /> Certificates
        </Link>

        <Link to="/admin/payments">
          <FaMoneyBill /> Payments
        </Link>

        <Link to="/admin/notifications">
          <FaBell /> Notifications
        </Link>

        <Link to="/admin/profile">
          <FaUser /> Profile
        </Link>

        <Link to="/admin/settings">
          <FaCog /> Settings
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;
