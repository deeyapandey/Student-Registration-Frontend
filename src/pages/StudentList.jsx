import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7074/api/registration/students"
        );
        console.log("API Response:", res.data);
        setStudents(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await axios.delete(`https://localhost:7074/api/registration/${id}`);
      // Remove deleted student from state
      setStudents((prev) => prev.filter((s) => s.studentId !== id));
      alert("Student deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Register New Student
      </Link>
      <h1 className="text-2xl font-bold mb-6">Registered Students</h1>
      {students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">ID</th>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-left p-3 border-b">Mobile</th>
              <th className="text-left p-3 border-b">Gender</th>
              <th className="text-left p-3 border-b">Citizenship No</th>
              <th className="text-left p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentId} className="hover:bg-gray-50">
                <td className="p-3 border-b">{s.studentId}</td>
                <td className="p-3 border-b">
                  {s.firstName} {s.middleName} {s.lastName}
                </td>
                <td className="p-3 border-b">{s.email}</td>
                <td className="p-3 border-b">{s.primaryMobile}</td>
                <td className="p-3 border-b">{s.gender}</td>
                <td className="p-3 border-b">{s.citizenshipNumber}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => navigate(`/students/${s.studentId}`)}
                    className="bg-blue-600 text-white px-4 py-1 my-2 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(s.studentId)}
                    className="bg-red-600 mx-2 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
