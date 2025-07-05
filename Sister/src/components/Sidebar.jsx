import React, { useEffect, useRef } from "react"; // tambahkan useRef dan useEffect
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom"; // import useNavigate untuk navigasi

export const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    // hanya jika digunakan di dalam komponen

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan.");
      }

      // Panggil endpoint logout ke Laravel
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal logout dari server");
      }

      // Bersihkan token di localStorage
      localStorage.removeItem("token");

      // Redirect ke halaman login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Logout gagal: " + error.message);
    }
  };

  const sidebarRef = useRef(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsExpanded]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed pt-20 bottom-5 top-2 left-5 h-screen bg-sky-400 text-white shadow-xl shadow-sky-400 transition-all duration-500 ease-in-out flex flex-col justify-between ${
        isExpanded ? "w-60 px-6" : "w-16 px-3"
      } py-4 z-50 rounded-4xl`}
    >
      {/* Logo dan tombol toggle */}
      <div className="flex items-center justify-between mb-8">
        {isExpanded && <h1 className="text-xl font-bold">LOGO</h1>}
        {!isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="text-2xl p-2" title="Buka Sidebar">
            <i className="ri-menu-3-fill" />
          </button>
        )}
      </div>

      {/* Menu */}
      <ul className="space-y-4 flex-1">
        {role !== "admin" && (
          <li>
            <Link to="/report" className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all">
              <i className="ri-home-3-fill text-xl" />
              {isExpanded && <span>Report</span>}
            </Link>
          </li>
        )}
        {(role === "hrd" || role === "spv") && (
          <li>
            <Link to="/evaluation" className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all">
              <i className="ri-edit-2-fill text-xl" />
              {isExpanded && <span>Penilaian</span>}
            </Link>
          </li>
        )}

        {role === "admin" && (
          <>
            <li>
              <Link to="/report-admin" className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all">
                <i className="ri-home-3-fill text-xl" /> {isExpanded && <span>Report</span>}
              </Link>
            </li>
            <li>
              <Link to="/create-user" className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all">
                <i className="ri-user-add-line text-xl" />
                {isExpanded && <span>Create User</span>}
              </Link>
            </li>
            <li>
              <Link to="/departments" className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all">
                <i className="ri-building-line text-xl" />
                {isExpanded && <span>Departments</span>}
              </Link>
            </li>
          </>
        )}

        <li>
          <div className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all cursor-pointer">
            <i className="ri-file-list-3-line text-xl" />
            {isExpanded && <span>Laporan</span>}
          </div>
        </li>

        <li>
          <div className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all cursor-pointer">
            <i className="ri-settings-3-fill text-xl" />
            {isExpanded && <span>Pengaturan</span>}
          </div>
        </li>

        <li>
          <div className="flex items-center gap-3 p-2 hover:bg-sky-500 rounded transition-all cursor-pointer" onClick={handleLogout}>
            <i className="ri-logout-box-r-line text-xl" />
            {isExpanded && <span>Logout</span>}
          </div>
        </li>
      </ul>

      {/* Footer Sosmed */}
      {isExpanded && (
        <div className="flex justify-around mt-6">
          <i className="ri-facebook-fill text-2xl hover:opacity-75 cursor-pointer" />
          <i className="ri-twitter-fill text-2xl hover:opacity-75 cursor-pointer" />
          <i className="ri-instagram-fill text-2xl hover:opacity-75 cursor-pointer" />
          <i className="ri-linkedin-fill text-2xl hover:opacity-75 cursor-pointer" />
        </div>
      )}
    </div>
  );
};
