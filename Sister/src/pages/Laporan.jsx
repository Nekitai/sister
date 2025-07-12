import React, { useState, useEffect } from "react";
import { Calendar, Download, Users, TrendingUp, TrendingDown, Search, BarChart3, PieChart, RefreshCw, Star, Award, Target, User, Trophy, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  Pie,
} from "recharts";
import { BarChart as BarIcon } from "lucide-react";

export const EmployeePerformanceReport = () => {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    summary: {},
    departments: [],
    performanceData: [],
    performanceTrend: [],
    ratingDistribution: [],
  });
  // const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [departments, setDepartments] = useState(["all"]);

  const API_BASE = "http://localhost:8000/api/reports";

  const fetchReportData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`; // format: 2025-07

    try {
      const [summaryRes, performanceRes, trendRes, distributionRes] = await Promise.all([
        fetch(`${API_BASE}/summary?month=${monthParam}`, { headers }).then((res) => res.json()),
        fetch(`${API_BASE}/performance?month=${monthParam}`, { headers }).then((res) => res.json()),
        fetch(`${API_BASE}/trend?month=${monthParam}`, { headers }).then((res) => res.json()),
        fetch(`${API_BASE}/distribution?month=${monthParam}`, { headers }).then((res) => res.json()),
      ]);

      setReportData({
        summary: summaryRes,
        departments: trendRes.departments || [],
        performanceData: performanceRes.data || [],
        performanceTrend: trendRes.trend || [],
        ratingDistribution: distributionRes.data || [],
      });
    } catch (err) {
      console.error("Gagal mengambil data dari backend:", err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await fetch("http://localhost:8000/api/departments", { headers });
      const data = await res.json();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Gagal mengambil departemen:", error.message);
    }
  };
  useEffect(() => {
  fetchDepartments();
}, []);


  const fetchFilterOptions = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [filtersRes, departmentsRes] = await Promise.all([fetch(`${API_BASE}/filters`, { headers }).then((res) => res.json()), fetch(`${API_BASE}/departments`, { headers }).then((res) => res.json())]);

      // setAvailableMonths(filtersRes.months || []);
      setAvailableYears(filtersRes.years || []);
      setDepartments(["all", ...departmentsRes.map((d) => d.name)]);
    } catch (err) {
      console.error("Gagal mengambil opsi filter:", err.message);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
    fetchReportData(); // juga ambil data awal
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-300";
    if (score >= 80) return "text-blue-300";
    if (score >= 70) return "text-yellow-300";
    return "text-red-300";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return "bg-green-500/20 text-green-300 border border-green-400/30";
    if (score >= 80) return "bg-blue-500/20 text-blue-300 border border-blue-400/30";
    if (score >= 70) return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
    return "bg-red-500/20 text-red-300 border border-red-400/30";
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case "Excellent":
      case "Sangat Baik":
        return "bg-green-500/20 text-green-300 border border-green-400/30";
      case "Very Good":
      case "Baik":
        return "bg-blue-500/20 text-blue-300 border border-blue-400/30";
      case "Good":
      case "Cukup":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
      case "Needs Improvement":
      case "Kurang":
        return "bg-red-500/20 text-red-300 border border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
    }
  };

  const handleExport = (format) => {
    const filename = `laporan_kinerja_${months[selectedMonth]}_${selectedYear}.${format}`;
    alert(`Mengexport laporan ke ${filename}`);
  };

  const filteredData = reportData.performanceData.filter((employee) => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const tabs = [
    { id: "overview", label: "Ringkasan Kinerja", icon: BarChart },
    { id: "individual", label: "Penilaian Individual", icon: User },
    { id: "departments", label: "Analisis Departemen", icon: PieChart },
    { id: "trends", label: "Tren Kinerja", icon: TrendingUp },
  ];

  const SummaryCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${color === "blue" ? "bg-blue-500/20" : color === "purple" ? "bg-purple-500/20" : color === "green" ? "bg-green-500/20" : "bg-red-500/20"}`}>
            <Icon className={`w-6 h-6 ${color === "blue" ? "text-blue-300" : color === "purple" ? "text-purple-300" : color === "green" ? "text-green-300" : "text-red-300"}`} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏆 Laporan Penilaian Kinerja Karyawan</h1>
              <p className="text-white/70">
                Evaluasi kinerja dan penilaian karyawan untuk {months[selectedMonth]} {selectedYear}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none">
                {months.map((month, index) => (
                  <option key={index} value={index} className="bg-gray-800">
                    {month}
                  </option>
                ))}
              </select>

              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none">
                {availableYears.map((year) => (
                  <option key={year} value={year} className="bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>

              <button onClick={() => handleExport("pdf")} className="bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2 text-white hover:bg-red-500/30 transition flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>

              <button onClick={fetchReportData} className="bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2 text-white hover:bg-blue-500/30 transition flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl flex items-center space-x-2 transition-all ${activeTab === tab.id ? "bg-white/20 text-white border border-white/30" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard icon={Users} title="Total Karyawan" value={reportData.summary.totalEmployees} color="blue" />
              <SummaryCard icon={Star} title="Rata-rata Skor" value={`${reportData.summary.averagePerformanceScore}/100`} color="purple" />
              <SummaryCard icon={Trophy} title="Top Performers" value={reportData.summary.topPerformers} subtitle="Skor ≥ 90" color="green" />
              <SummaryCard icon={Target} title="Perlu Perbaikan" value={reportData.summary.improvementNeeded} subtitle="Skor < 80" color="red" />
            </div>

            {/* Performance Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-white text-xl font-bold mb-4">📊 Distribusi Rating</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie data={reportData.ratingDistribution} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {reportData.ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-white text-xl font-bold mb-4">📈 Tren Skor Rata-rata</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={reportData.performanceTrend}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Area type="monotone" dataKey="avgScore" stroke="#3B82F6" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Overview */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">🏢 Ringkasan Per Departemen</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3">Departemen</th>
                      <th className="text-right py-3">Karyawan</th>
                      <th className="text-right py-3">Skor Rata-rata</th>
                      <th className="text-right py-3">Disiplin</th>
                      <th className="text-right py-3">Tanggung Jawab</th>
                      <th className="text-right py-3">Kerja Tim</th>
                      <th className="text-right py-3">Inisiatif</th>
                      <th className="text-right py-3">Keahlian</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.departments.map((dept, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-3 font-medium">{dept.name}</td>
                        <td className="text-right py-3">{dept.employees}</td>
                        <td className="text-right py-3">
                          <span className={`font-bold ${getScoreColor(dept.avgScore)}`}>{dept.avgScore}</span>
                        </td>
                        <td className="text-right py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(dept.productivity)}`}>{dept.productivity}%</span>
                        </td>
                        <td className="text-right py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(dept.quality)}`}>{dept.quality}%</span>
                        </td>
                        <td className="text-right py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(dept.teamwork)}`}>{dept.teamwork}%</span>
                        </td>
                        <td className="text-right py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(dept.initiative)}`}>{dept.initiative}%</span>
                        </td>
                        <td className="text-right py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(dept.communication || 0)}`}>{dept.communication || 0}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "individual" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-white text-sm mb-2">Cari Karyawan</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Masukkan nama karyawan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="lg:w-48">
                  <label className="block text-white text-sm mb-2">Departemen</label>
                  <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none">
                    <option value="all" className="bg-gray-800">
                      Semua Departemen
                    </option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name} className="bg-gray-800">
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Individual Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData.map((employee, index) => (
                <div key={index} className="bg-white/10 border border-white/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{employee.name}</h4>
                      <p className="text-white/60">{employee.department}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(employee.performanceScore)}`}>{employee.performanceScore}/100</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium mt-1 ${getRatingColor(employee.overallRating)}`}>{employee.overallRating}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Disiplin</span>
                      <span className={`font-bold ${getScoreColor(employee.productivity)}`}>{employee.productivity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Tanggung Jawab</span>
                      <span className={`font-bold ${getScoreColor(employee.quality)}`}>{employee.quality}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Kerja Tim</span>
                      <span className={`font-bold ${getScoreColor(employee.teamwork)}`}>{employee.teamwork}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Inisiatif</span>
                      <span className={`font-bold ${getScoreColor(employee.initiative)}`}>{employee.initiative}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Keahlian</span>
                      <span className={`font-bold ${getScoreColor(employee.communication)}`}>{employee.communication}%</span>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <div>
                      <p className="text-white/70 text-sm">Notes:</p>
                      <p className="text-white text-sm">{employee.goals}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "departments" && (
          <div className="space-y-6">
            {/* Department Performance Comparison */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">📊 Perbandingan Performa Departemen</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.departments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#3B82F6" name="Skor Rata-rata" />
                  <Bar dataKey="productivity" fill="#10B981" name="Produktivitas" />
                  <Bar dataKey="quality" fill="#F59E0B" name="Kualitas" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">🎯 Analisis Kompetensi Per Departemen</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart outerRadius={120} data={reportData.departments}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="name" stroke="#ffffff80" />
                  <PolarRadiusAxis stroke="#ffffff40" />
                  <Radar name="Teamwork" dataKey="teamwork" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Radar name="Inisiatif" dataKey="initiative" stroke="#F472B6" fill="#F472B6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-6">
            {/* Performance Trend Line Chart */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">📈 Tren Kinerja Bulanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" name="Skor Rata-rata" strokeWidth={2} />
                  <Line type="monotone" dataKey="topPerformers" stroke="#10B981" name="Top Performers" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
