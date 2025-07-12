import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Users, Building, Settings, LogOut, Edit, UserPlus, BarChart3 } from "lucide-react";

export const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan.");

      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal logout");
      }

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      alert("Logout gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsExpanded]);

  const menuItems = [
    ...(role === "hrd" ? [{ path: "/laporan", label: "Laporan", icon: FileText, color: "text-yellow-300" }] : []),

    // hanya tampil jika BUKAN admin DAN BUKAN hrd
    ...(role !== "admin" && role !== "hrd" ? [{ path: "/report", icon: Home, label: "Report", color: "text-blue-300" }] : []),

    ...(role === "hrd" || role === "spv" ? [{ path: "/evaluation", icon: Edit, label: "Penilaian", color: "text-green-300" }] : []),

    ...(role === "admin"
      ? [
          { path: "/report-admin", icon: BarChart3, label: "Report", color: "text-blue-300" },
          { path: "/create-user", icon: UserPlus, label: "Create User", color: "text-purple-300" },
          { path: "/departments", icon: Building, label: "Departments", color: "text-orange-300" },
        ]
      : []),

    ...(role !== "admin" ? [{ path: "/setting", icon: Settings, label: "Pengaturan", color: "text-gray-300" }] : []),
  ];

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {isExpanded && <div className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden bg-black/80" onClick={() => setIsExpanded(false)} />}

      <div ref={sidebarRef} className={`fixed top-0 left-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-white/10 text-white shadow-2xl transition-all duration-300 flex flex-col z-50 ${isExpanded ? "w-72" : "w-16"}`}>
        {/* Header / Logo */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-white/10">
          {isExpanded ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">LOGO</h1>
                  <p className="text-xs text-blue-100/70">Penilaian Karyawan</p>
                </div>
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative border ${
                  isActive ? "bg-blue-600/20 border-blue-500/30 shadow-lg" : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-600/30 hover:border-slate-500/50"
                }`}
              >
                <Icon className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"} ${isActive ? "text-blue-300" : item.color}`} />
                {isExpanded && <span className={`font-medium ${isActive ? "text-blue-300" : "text-white"}`}>{item.label}</span>}
                {isActive && <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full shadow-lg" />}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 bg-slate-800/50 hover:bg-red-500/20 border border-slate-600/30 hover:border-red-500/50 group"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <LogOut className={`${isExpanded ? "w-5 h-5" : "w-6 h-6"} text-red-300 group-hover:text-red-200`} />}
            {isExpanded && <span className="font-medium text-red-300 group-hover:text-red-200">{isLoading ? "Logging out..." : "Logout"}</span>}
          </button>
        </div>
        {isExpanded && (
          <div className="text-xs text-center p-2">
            <p className="text-xs text-blue-100/70">Thank for ChatGpt And Claude.ai</p>
          </div>
        )}
      </div>
    </>
  );
};
