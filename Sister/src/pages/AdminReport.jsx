import React, { useEffect, useState } from "react";
import { Users, Trash2, Edit3, UserCheck, AlertCircle, CheckCircle, Building2, User2 } from "lucide-react";

export const AdminReport = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat data pengguna");
      }

      const data = await response.json();
      setUsers(data.users || []);

      // Hitung total user (selain admin)
      const filteredUsers = data.users.filter((user) => user.role !== "admin");
      setUserCount(filteredUsers.length);

      // Hitung jumlah unik departemen
      const uniqueDepartments = new Set(
        filteredUsers.map((user) => user.department?.name).filter(Boolean)
      );
      setDepartmentCount(uniqueDepartments.size);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Gagal memuat data pengguna");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menghapus user");
      }

      setSuccessMessage("User berhasil dihapus!");
      fetchUsers(); // refresh data
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage("Gagal menghapus user: " + error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "manager":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "supervisor":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "user":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-6 py-8">
      <div className="w-full">
        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 border border-white/20 backdrop-blur-lg p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <User2 className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="text-white text-xl font-bold">{userCount}</div>
              <div className="text-white/70">Total Pengguna</div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur-lg p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="text-white text-xl font-bold">{departmentCount}</div>
              <div className="text-white/70">Total Departemen</div>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-8 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Daftar Pengguna</h1>
                <p className="text-blue-100/70">Kelola semua pengguna dalam sistem</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">#</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Nama</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Username</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Departemen</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((user) => user.role !== "admin").length > 0 ? (
                    users
                      .filter((user) => user.role !== "admin")
                      .map((user, index) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="px-6 py-4 text-white/60 text-center">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/70">@{user.username}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getRoleColor(user.role)}`}>{user.role}</span>
                          </td>
                          <td className="px-6 py-4 text-white/70">{user.department?.name || "-"}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-colors duration-200 group">
                                <Edit3 className="w-4 h-4 text-blue-300 group-hover:text-blue-200" />
                              </button>
                              <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors duration-200 group">
                                <Trash2 className="w-4 h-4 text-red-300 group-hover:text-red-200" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-white/50" />
                          </div>
                          <div className="text-white/50 text-lg">Tidak ada data pengguna</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
