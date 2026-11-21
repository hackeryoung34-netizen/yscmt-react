import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import adminApi from "../services/adminApi";
import "./Dashboard.css";

type DashboardStats = {
  courses: number;
  lessons: number;
  students: number;
  quiz_attempts: number;
  certificates: number;
  payments: number;
};

const EMPTY_STATS: DashboardStats = {
  courses: 0,
  lessons: 0,
  students: 0,
  quiz_attempts: 0,
  certificates: 0,
  payments: 0,
};

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await adminApi.getDashboard();
        if (active) setStats(response.data);
      } catch (requestError: any) {
        if (!active) return;
        if (requestError?.response?.status === 401) {
          setError("Please sign in with your YSCMT administrator account.");
        } else if (requestError?.response?.status === 403) {
          setError("Access denied. This dashboard is for YSCMT administrators only.");
        } else {
          setError("The dashboard data could not be loaded. Please try again later.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const cards: { label: string; value: number }[] = [
    { label: "Courses", value: stats.courses },
    { label: "Lessons", value: stats.lessons },
    { label: "Students", value: stats.students },
    { label: "Quiz Attempts", value: stats.quiz_attempts },
    { label: "Certificates", value: stats.certificates },
    { label: "Payments", value: stats.payments },
  ];

  return (
    <AdminLayout>
      <h1>YSCMT Admin Dashboard</h1>

      {error ? (
        <div role="alert" className="my-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      ) : (
        <div className="cards" aria-busy={loading}>
          {cards.map((card) => (
            <div className="card" key={card.label}>
              <h2>{card.label}</h2>
              <h1>{loading ? "…" : card.value.toLocaleString()}</h1>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default Dashboard;
