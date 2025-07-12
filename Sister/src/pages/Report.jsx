import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const Report = ({ isSidebarOpen }) => {
  const [latestScore, setLatestScore] = useState(null);
  const [linguisticLabel, setLinguisticLabel] = useState(null);
  const [monthlyScores, setMonthlyScores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/dashboard-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLatestScore(data.latest_score);
        setMonthlyScores(data.monthly_scores);

        const label = data.latest_score >= 85 ? "Sangat Baik" : data.latest_score >= 75 ? "Baik" : data.latest_score >= 65 ? "Cukup" : data.latest_score >= 50 ? "Kurang" : "Sangat Kurang";

        setLinguisticLabel(label);
      });
  }, []);

  const wrapperClass = `transition-all duration-300 w-full min-h-screen p-6 ${isSidebarOpen ? "ml-60" : "ml-12"} bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden`;

  return (
    <div className={wrapperClass}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-300/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-300/20 rounded-full animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-10">
        {/* Header Section */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2"> Dashboard Penilaian</h1>
              <p className="text-white/70 text-lg">Pantau performa dan progress penilaian Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
                <span className="text-white/90 text-sm font-medium">
                  🕐{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Kartu atas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Kiri: Nilai terbaru */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 min-h-[160px] flex items-center justify-center flex-col hover:bg-white/15 transition-all duration-300 group">
            <h2 className="text-xl font-semibold text-white/90 mb-4 group-hover:text-white transition-colors">Nilai Terbaru</h2>
            <p className="text-5xl font-bold text-white drop-shadow-lg">{latestScore !== null ? latestScore : "--"}</p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              <span className="text-white/60 text-sm">dari 100</span>
            </div>
            <div className="mt-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1">
              <span className="text-white/80 text-xs">{latestScore >= 85 ? "🔥 Excellent" : latestScore >= 70 ? "✨ Good" : "💪 Keep Going"}</span>
            </div>
          </div>

          {/* Kanan: Hasil linguistik */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 min-h-[160px] flex items-center justify-center flex-col hover:bg-white/15 transition-all duration-300 group">
            <h2 className="text-xl font-semibold text-white/90 mb-4 group-hover:text-white transition-colors">Hasil</h2>
            <p className="text-4xl font-bold text-white drop-shadow-lg text-center">{linguisticLabel || "--"}</p>
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
              <span className="text-white/60 text-sm">kategori</span>
            </div>
            <div className="mt-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1">
              <span className="text-white/80 text-xs">{linguisticLabel === "Sangat Baik" ? "🎯 Top Performance" : "📈 Growing"}</span>
            </div>
          </div>
        </div>

        {/* Bawah: Grafik statistik */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white/90 mb-1">📈 Statistik Penilaian Tahunan</h2>
              <p className="text-white/60 text-sm">Tracking performa bulanan Anda</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1">
                <span className="text-white/80 text-xs">Rata-rata: {Math.round(monthlyScores.filter((s) => s.score > 0).reduce((a, b) => a + b.score, 0) / monthlyScores.filter((s) => s.score > 0).length)}</span>
              </div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyScores} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} fontWeight="500" />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.7)" fontSize={12} fontWeight="500" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    color: "white",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 8,
                    fill: "#3b82f6",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{Math.max(...monthlyScores.filter((s) => s.score > 0).map((s) => s.score))}</div>
              <div className="text-white/60 text-xs">Skor Tertinggi</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{monthlyScores.filter((s) => s.score > 0).length}</div>
              <div className="text-white/60 text-xs">Bulan Aktif</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{latestScore >= 85 ? "🔥" : latestScore >= 70 ? "📈" : "💪"}</div>
              <div className="text-white/60 text-xs">Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
