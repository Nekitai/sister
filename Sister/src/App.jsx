import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./components/Login";
import { Report } from "./pages/Report";
import { Unauthorized } from "./pages/Unauthorized";
import { CreateUser } from "./pages/CreateUser";
import { AdminReport } from "./pages/AdminReport";
import { DepartmentList } from "./pages/DepartmentList";
import { EvaluationForm } from "./pages/Evaluations";
import { CircularProgress } from "@mui/material";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

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
          if (!res.ok) throw new Error("Gagal fetch user");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
        <p className="ml-2">Checking Session......</p>
      </div>
    );
  }

  const isAdmin = user && user.role === "admin";

  return (
    <Routes>
      <Route
        path="/report-admin"
        element={
          isAuthenticated && user ? (
            <div className="flex w-full">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>{user.role === "admin" ? <AdminReport /> : <Report />}</div>
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
      <Route
        path="/report"
        element={
          isAuthenticated && user ? (
            <div className="flex">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                <Report />
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/evaluation"
        element={
          isAuthenticated && (user?.role === "spv" || user?.role === "hrd") ? (
            <div className="flex">
              <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} user={user} />
              <div className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                <EvaluationForm />
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
