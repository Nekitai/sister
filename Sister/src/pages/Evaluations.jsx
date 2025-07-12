import React, { useEffect, useState } from "react";
import { Check, X, Users, Calendar, Star } from "lucide-react";

export default function Evaluation() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    discipline: "",
    responsibility: "",
    initiative: "",
    teamwork: "",
    field_score: "",
    month: "",
    notes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        const currentUser = data.current_user; // pastikan backend kirim user login saat ini
        const usersList = data.users || data.data || [];

        let filtered = [];

        if (currentUser.role === "hrd") {
          filtered = usersList.filter((u) => u.role !== "admin");
        } else if (currentUser.role === "spv") {
          filtered = usersList.filter((u) => u.role === "karyawan" && u.department_id === currentUser.department_id);
        }

        setEmployees(filtered);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/evaluations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Penilaian gagal dikirim");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      setSuccessMessage("Penilaian berhasil dikirim!");
      setForm({
        employee_id: "",
        discipline: "",
        responsibility: "",
        initiative: "",
        teamwork: "",
        field_score: "",
        month: "",
        notes: "",
      });
      setIsLoading(false);
    }, 1500);
  };

  const evaluationFields = [
    { name: "discipline", label: "Disiplin", icon: Check },
    { name: "responsibility", label: "Tanggung Jawab", icon: Users },
    { name: "initiative", label: "Inisiatif", icon: Star },
    { name: "teamwork", label: "Kerja Tim", icon: Users },
    { name: "field_score", label: "Nilai Lapangan", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Main glass container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Alerts */}
          {successMessage && (
            <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300">{successMessage}</span>
                <button onClick={() => setSuccessMessage("")} className="ml-auto text-green-400 hover:text-green-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 p-4 mb-6">
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{errorMessage}</span>
                <button onClick={() => setErrorMessage("")} className="ml-auto text-red-400 hover:text-red-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Form Penilaian Karyawan</h1>
                <p className="text-blue-100/70">Evaluasi kinerja karyawan bulanan</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 pt-0">
            <div className="space-y-6">
              {/* Employee and Month Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Pilih Karyawan</span>
                  </label>
                  <select
                    name="employee_id"
                    value={form.employee_id}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-white">
                      -- Pilih Karyawan --
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id} className="bg-gray-800 text-white">
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Bulan Penilaian</span>
                  </label>
                  <input
                    type="month"
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Evaluation Scores */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">Penilaian Kinerja</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {evaluationFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.name}>
                        <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{field.label}</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            required
                            min={1}
                            max={100}
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                            placeholder="1-100"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-white/60 text-sm">/100</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-white/80 font-medium mb-2 flex items-center space-x-2">
                  <span>Catatan Tambahan</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  placeholder="Tambahkan catatan atau komentar untuk karyawan..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Kirim Penilaian</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
