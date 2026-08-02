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

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await api.get("students/");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-500">
            Manage registered students
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Add Student
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="border-t dark:border-gray-700"
                >
                  <td className="p-4">{student.id}</td>

                  <td className="p-4">{student.username}</td>

                  <td className="p-4">
                    {student.first_name} {student.last_name}
                  </td>

                  <td className="p-4">{student.email}</td>

                  <td className="p-4 text-right">
                    <button className="mr-4 text-blue-600 hover:underline">
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
