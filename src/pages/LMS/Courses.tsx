import { useEffect, useState } from "react";
import api from "../../services/api";

type Course = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await api.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-500">
            Manage all available courses
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Add Course
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Course</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Price</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4">
                  Loading...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4">
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t dark:border-gray-700"
                >
                  <td className="p-4">{course.id}</td>
                  <td className="p-4 font-medium">{course.name}</td>
                  <td className="p-4">{course.description}</td>
                  <td className="p-4">₦{course.price}</td>

                  <td className="p-4 text-right">
                    <button className="text-blue-600 mr-4">
                      Edit
                    </button>

                    <button className="text-red-600">
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
