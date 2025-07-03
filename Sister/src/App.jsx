import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./components/Login";
import { Report } from "./pages/Report";
import { Unauthorized } from "./pages/Unauthorized";
import { CreateUser } from "./pages/CreateUser";
import { AdminReport } from "./pages/AdminReport";
import { DepartmentList } from "./pages/DepartmentList";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setIsAuthenticated(true);
          setUser(data);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const isAdmin = user?.role === "admin";
  if (isAuthenticated && user === null) {
    // loading dulu sebelum user siap
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/report-admin"
        element={
          isAuthenticated && user ? (
            <div className="flex w-full">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                {user.role === "admin" ? <AdminReport /> : <Report />}
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/create-user"
        element={
          isAuthenticated && isAdmin ? (
            <div className="flex">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                <CreateUser />
              </div>
            </div>
          ) : isAuthenticated ? (
            <Navigate to="/unauthorized" />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/departments"
        element={
          isAuthenticated && isAdmin ? (
            <div className="flex">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                <DepartmentList />
              </div>
              
            </div>
          ) : isAuthenticated ? (
            <Navigate to="/unauthorized" />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
