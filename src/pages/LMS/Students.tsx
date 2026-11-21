import { useEffect, useState } from "react";
import api from "../../services/api";

type Student = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get("students/");
        setStudents(response.data);
      } catch (requestError: any) {
        if (requestError?.response?.status === 403) {
          setError("This directory is available to YSCMT administrators only.");
        } else {
          setError("Unable to load students. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="mt-1 text-sm text-gray-500">Registered YSCMT student accounts</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading students...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Student records are not available.</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No student accounts found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="p-4">{student.id}</td>
                    <td className="p-4 font-medium">{student.username}</td>
                    <td className="p-4">{[student.first_name, student.last_name].filter(Boolean).join(" ") || "—"}</td>
                    <td className="p-4">{student.email || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
