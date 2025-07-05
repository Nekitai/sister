import React, { useEffect, useState } from "react";
import { 
  UserPlus, 
  Users, 
  Mail, 
  User, 
  Lock, 
  Shield, 
  Building, 
  Edit3, 
  Trash2, 
  UserCheck,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react";

// Mock data untuk demo


export const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    role: "",
    department_id: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-hide messages
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch users function
  

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDepartments(data.departments || data);
        
      } catch (error) {
        console.error("Gagal mengambil data departemen:", error);
      }
    };
    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    if (form.password !== form.password_confirmation) {
      setErrorMessage("Password dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      // Simulasi untuk demo
      const newUser = {
        id: users.length + 1,
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        department: departments.find(d => d.id === parseInt(form.department_id))
      };
      
      setUsers([...users, newUser]);
      setSuccessMessage("User berhasil ditambahkan!");
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        role: "",
        department_id: "",
      });

      
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/create-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal tambah user");
      }

      setSuccessMessage("User berhasil ditambahkan!");
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
        role: "",
        department_id: "",
      });
    } catch (error) {
      setErrorMessage("Gagal menambahkan user: " + error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Alert Messages */}
        {errorMessage && (
          <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{errorMessage}</span>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manajemen Pengguna</h1>
              <p className="text-blue-100/70">Tambah dan kelola pengguna sistem</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Plus className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Tambah Pengguna Baru</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Nama</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="user@example.com"
                />
              </div>

              {/* Username Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="username"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Role</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                >
                  <option value="" className="bg-gray-800">-- Pilih Role --</option>
                  <option value="hrd" className="bg-gray-800">HRD</option>
                  <option value="spv" className="bg-gray-800">Supervisor</option>
                  <option value="karyawan" className="bg-gray-800">Karyawan</option>
                </select>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Password Confirmation Field */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Konfirmasi Password</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Department Field - Full Width */}
            <div>
              <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Departemen</span>
              </label>
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="" className="bg-gray-800">-- Pilih Departemen --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-gray-800">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};