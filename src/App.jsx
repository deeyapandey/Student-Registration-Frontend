import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Add Link, Routes, Route, Router
import RegistrationForm from "../src/pages/StudentRegistration";
import StudentList from "../src/pages/StudentList";
import StudentDetail from "../src/pages/StudentDetail";
import StudentEdit from "../src/pages/StudentEdit";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Routes>
        <Route
          path="/"
          element={
            <RegistrationForm
              onRegistered={() => setRefresh((prev) => !prev)}
            />
          }
        />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/edit/:id" element={<StudentEdit />} />
      </Routes>
    </div>
  );
}

export default App;
