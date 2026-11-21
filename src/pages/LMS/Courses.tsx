import { useEffect, useState } from "react";
import api from "../../services/api";

type Course = {
  id: number;
  name: string;
  description: string;
  price: number | string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchCourses() {
      try {
        const response = await api.get("courses/");
        const data = response.data;
        if (active) {
          setCourses(Array.isArray(data) ? data : data?.results ?? []);
        }
      } catch {
        if (active) setError("Unable to load courses right now. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-gray-500">Explore available YSCMT learning courses</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Course</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4">Loading courses...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="p-4 text-gray-500">Courses are temporarily unavailable.</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-gray-500">No courses have been published yet.</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="p-4">{course.id}</td>
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4">{course.description}</td>
                    <td className="p-4">₦{Number(course.price).toLocaleString("en-NG")}</td>
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
