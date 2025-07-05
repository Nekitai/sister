import React, { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  CheckCircle, 
  XCircle, 
  LogIn,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login = ({ setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.identifier || !formData.password) {
        setErrorMessage("Email dan password harus diisi.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      const token = data.access_token;
      localStorage.setItem("token", token);

      // Get user data for role
      const userRes = await fetch("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const userData = await userRes.json();
      localStorage.setItem("role", userData.role);

      setUser(userData);
      setIsAuthenticated(true);
      setSuccessMessage("Login berhasil!");

      // Redirect based on role
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/report-admin");
        } else {
          navigate("/report");
        }
      }, 1000);

    } catch (error) {
      setErrorMessage("Login gagal: " + error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-blue-100/70">Sign in to your account</p>
            </div>

            {/* Alerts */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage("")}
                  className="ml-auto text-green-400 hover:text-green-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage("")}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email/Username Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-white/80">
                  <User className="w-4 h-4" />
                  <span>Email or Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your email or username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-white/80">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-white/10 border border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              © 2025 Penilaian Karyawan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};