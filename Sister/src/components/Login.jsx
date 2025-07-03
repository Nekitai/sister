import React from "react";
import { useNavigate } from "react-router-dom"; 

export const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const identifier = document.getElementById("email").value.trim(); // bisa email atau username
      const password = document.getElementById("password").value;

      if (!identifier || !password) {
        alert("Email/Username dan Password wajib diisi");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: identifier,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal");
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.access_token);

      // Redirect ke dashboard
      setIsAuthenticated(true);
      if (data.role === "admin") {
        navigate("/report-admin");
      } else {
        navigate("/report");
      }
      alert("Login berhasil!");
    } catch (error) {
      alert("Login gagal: " + error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container max-w-sm mx-auto min-h-screen flex items-center justify-center">
      <div className="bg-sky-600 bg shadow-md rounded-md px-8 py-9 w-full">
        <h2 className="text-4xl font-bold text-center text-white mb-7 ">Login</h2>

        {/* Email */}
        <div className="mb-4 font-medium">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Your Email/Username
          </label>
          <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="example@email.com/username" />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Your Password
          </label>
          <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="********" />
        </div>

        {/* Remember Me */}
        <div className="mb-4 flex items-center">
          <input type="checkbox" id="remember" className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-sky-500 text-white hover:text-sky-500 hover:bg-white px-4 py-2 rounded  transition duration-300" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};
