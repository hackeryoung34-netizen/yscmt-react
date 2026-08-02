import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import adminApi from "../services/adminApi";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    students: 0,
    quiz_attempts: 0,
    certificates: 0,
    payments: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await adminApi.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AdminLayout>
      <h1>YSCMT Admin Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>Courses</h2>
          <h1>{stats.courses}</h1>
        </div>

        <div className="card">
          <h2>Lessons</h2>
          <h1>{stats.lessons}</h1>
        </div>

        <div className="card">
          <h2>Students</h2>
          <h1>{stats.students}</h1>
        </div>

        <div className="card">
          <h2>Quiz Attempts</h2>
          <h1>{stats.quiz_attempts}</h1>
        </div>

        <div className="card">
          <h2>Certificates</h2>
          <h1>{stats.certificates}</h1>
        </div>

        <div className="card">
          <h2>Payments</h2>
          <h1>{stats.payments}</h1>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
