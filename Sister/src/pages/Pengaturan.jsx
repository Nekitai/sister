import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Shield, Save, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const ProfileSecuritySettings = ({ isSidebarOpen = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    department_id: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Keamanan", icon: Shield },
  ];

  // Notification component
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/departments", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        setDepartments(data.departments || data); // tergantung struktur JSON dari backend
      } catch (err) {
        console.error("Gagal ambil departemen:", err);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data profil");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          username: data.username,
          email: data.email,
          fullName: data.name,
          department_id: data.department_id,
        }));
      } catch (err) {
        console.error(err);
        showNotification("error", "Gagal mengambil data profil");
      }
    };
    fetchProfile();
  }, []);
  const Select = ({ label, options, value, onChange }) => (
    <div>
      <label className="block text-white text-sm mb-2">{label}</label>
      <select value={value} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors">
        <option value="">Pilih {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="bg-gray-800">
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
  const selectedDept = departments.find((d) => d.id == formData.department_id);
  console.log("Departemen yang dipilih:", selectedDept?.name);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (activeTab === "profile") {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            username: formData.username,
            department_id: formData.department,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Gagal update profil");
        }
        showNotification("success", "Profil berhasil diperbarui!");
      } catch (err) {
        console.error(err);
        showNotification("error", "Terjadi kesalahan saat menyimpan profil");
      }
    }

    if (activeTab === "security") {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        return showNotification("warning", "Semua kolom password harus diisi");
      }
      if (formData.newPassword !== formData.confirmPassword) {
        return showNotification("warning", "Konfirmasi password tidak cocok");
      }
      if (formData.newPassword.length < 8) {
        return showNotification("warning", "Password baru minimal 8 karakter");
      }
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profile/password", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            current_password: formData.currentPassword,
            password: formData.newPassword,
            password_confirmation: formData.confirmPassword,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Gagal update password");
        }
        showNotification("success", "Password berhasil diperbarui!");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } catch (err) {
        console.error(err);
        showNotification("error", "Gagal update password: " + err.message);
      }
    }
  };

  const wrapperClass = `transition-all duration-300 w-full min-h-screen p-6 ${isSidebarOpen ? "ml-60" : "ml-2"} bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden`;

  return (
    <div className={wrapperClass}>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === "success" ? "bg-green-500/90" : notification.type === "error" ? "bg-red-500/90" : "bg-yellow-500/90"
          } text-white backdrop-blur-sm`}
        >
          {notification.type === "success" && <CheckCircle className="w-5 h-5" />}
          {notification.type === "error" && <XCircle className="w-5 h-5" />}
          {notification.type === "warning" && <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-white/80 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 p-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">⚙️ Pengaturan Akun</h1>
              <p className="text-white/70">Kelola profil dan keamanan akun Anda</p>
            </div>
            <button onClick={handleSave} className="bg-green-500/20 border border-green-400/30 rounded-full px-6 py-2 text-white hover:bg-green-500/30 transition flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Simpan</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center space-x-2 ${activeTab === tab.id ? "bg-white/20 text-white border border-white/30" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "profile" && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">👤 Informasi Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} />
              <Input label="Email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
              <Input label="Nama Lengkap" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
              <Select label="Departemen" options={departments} value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-white text-xl font-bold mb-4">🔒 Keamanan Akun</h2>
            <div className="space-y-4">
              <PasswordInput label="Password Saat Ini" value={formData.currentPassword} onChange={(e) => handleInputChange("currentPassword", e.target.value)} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
              <PasswordInput label="Password Baru" value={formData.newPassword} onChange={(e) => handleInputChange("newPassword", e.target.value)} show={showNewPassword} toggle={() => setShowNewPassword(!showNewPassword)} />
              <PasswordInput
                label="Konfirmasi Password Baru"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                💡 <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, kecil, angka, dan simbol. Minimal 8 karakter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-white text-sm mb-2">{label}</label>
    <input type="text" value={value} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors" />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-white text-sm mb-2">{label}</label>
    <select value={value} onChange={onChange} className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors">
      <option value="">Pilih {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-800">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const PasswordInput = ({ label, value, onChange, show, toggle }) => (
  <div>
    <label className="block text-white text-sm mb-2">{label}</label>
    <div className="relative">
      <input type={show ? "text" : "password"} value={value} onChange={onChange} className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors" />
      <button type="button" onClick={toggle} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-300 transition-colors">
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

export default ProfileSecuritySettings;
