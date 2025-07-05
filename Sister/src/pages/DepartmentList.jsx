import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Save, X, Users, Building2, AlertTriangle } from "lucide-react";

export const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  // Mock token untuk demo - dalam aplikasi nyata, ambil dari context/state management
  const token = localStorage.getItem("token");

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Mock data untuk demo
  

  const fetchDepartments = useCallback(async () => {
    if (!token) {
      setError("Token tidak tersedia. Silakan login terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulasi API call dengan delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dalam aplikasi nyata, gunakan fetch ke API

      const response = await fetch("http://127.0.0.1:8000/api/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data departemen");
      }

      const departmentList = data.departments || data.data || data;
      setDepartments(departmentList);

      setDepartments(departmentList);
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError("Gagal mengambil data departemen: " + error.message);
    } finally {
      setLoading(false); // Pastikan loading selalu di-reset
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Add department
  const handleAddDepartment = async () => {
    if (!name.trim()) {
      setError("Nama departemen tidak boleh kosong");
      return;
    }

    if (!token) {
      setError("Token tidak tersedia. Silakan login terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("http://127.0.0.1:8000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan departemen");
      }
      const newDepartment = result.department;

      setDepartments((prev) => [...prev, newDepartment]);
      setName("");
      setSuccess("Departemen berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan:", error);
      setError("Gagal menambahkan: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false); // Pastikan loading selalu di-reset
    }
  };

  // Start editing
  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Save edit
  const handleEditDepartment = async (id) => {
    if (!editingName.trim()) {
      setError("Nama departemen wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dalam aplikasi nyata, gunakan fetch ke API

      const response = await fetch(`http://127.0.0.1:8000/api/departments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal mengubah data");
      }

      // Update local state
      setDepartments((prev) => prev.map((dept) => (dept.id === id ? { ...dept, name: editingName.trim() } : dept)));

      setSuccess("Departemen berhasil diubah!");
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      setError("Gagal mengubah: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (dept) => {
    setDepartmentToDelete(dept);
    setShowDeleteModal(true);
  };

  // Hide delete confirmation modal
  const hideDeleteConfirmation = () => {
    setShowDeleteModal(false);
    setDepartmentToDelete(null);
  };

  // Delete department
  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dalam aplikasi nyata, gunakan fetch ke API

      const response = await fetch(`http://127.0.0.1:8000/api/departments/${departmentToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal menghapus departemen");
      }

      // Update local state
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentToDelete.id));
      setSuccess("Departemen berhasil dihapus!");
      hideDeleteConfirmation();
    } catch (error) {
      setError("Gagal menghapus departemen: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 mb-6 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Manajemen Departemen</h1>
          </div>
          <p className="text-white/70 text-lg">Kelola departemen dalam organisasi Anda</p>
          <p className="text-white/50 text-sm mt-2">Demo Mode - Data tersimpan sementara</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-100 animate-pulse">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="backdrop-blur-md bg-green-500/20 border border-green-500/30 rounded-2xl p-4 mb-6 text-green-100 animate-pulse">
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Add Department Form */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 mb-6 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Plus className="w-6 h-6" />
            Tambah Departemen Baru
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Departemen"
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && !loading && handleAddDepartment()}
              />
            </div>
            <button
              onClick={handleAddDepartment}
              disabled={loading || !name.trim()}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Plus className="w-5 h-5" />}
              {loading ? "Menambah..." : "Tambah"}
            </button>
          </div>
        </div>

        {/* Departments Table */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Daftar Departemen
          </h2>

          {loading && departments.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/70">Memuat data departemen...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-6 text-white font-semibold">Nama Departemen</th>
                    <th className="text-right py-4 px-6 text-white font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <tr key={dept.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          {editingId === dept.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              autoFocus
                              onKeyPress={(e) => e.key === "Enter" && handleEditDepartment(dept.id)}
                            />
                          ) : (
                            <span className="text-white text-lg">{dept.name}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            {editingId === dept.id ? (
                              <>
                                <button
                                  onClick={() => handleEditDepartment(dept.id)}
                                  disabled={loading}
                                  className="p-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEditing} disabled={loading} className="p-2 bg-gray-500/20 border border-gray-500/30 rounded-xl text-gray-300 hover:bg-gray-500/30 disabled:opacity-50 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(dept.id, dept.name)}
                                  disabled={loading}
                                  className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 disabled:opacity-50 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => showDeleteConfirmation(dept)}
                                  disabled={loading}
                                  className="p-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center py-12 text-white/70">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Tidak ada data departemen.</p>
                        <p className="text-sm">Tambahkan departemen pertama Anda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Konfirmasi Hapus</h3>
                <p className="text-red-200/70">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-white/90 text-lg mb-2">Apakah Anda yakin ingin menghapus departemen:</p>
              <p className="text-xl font-bold text-red-200 bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/30">"{departmentToDelete?.name}"</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={hideDeleteConfirmation}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gray-500/20 border border-gray-500/30 rounded-2xl text-gray-300 font-semibold hover:bg-gray-500/30 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteDepartment}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Trash2 className="w-5 h-5" />}
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
