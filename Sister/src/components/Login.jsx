import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { CheckIcon } from "@heroicons/react/16/solid";

export const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      const identifier = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!identifier || !password) {
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
          login: identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      const token = data.access_token;
      localStorage.setItem("token", token);

      // 🔥 Ambil data user untuk tahu role-nya
      const userRes = await fetch("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const userData = await userRes.json();

      localStorage.setItem("role", userData.role); // simpan role ke localStorage

      setIsAuthenticated(true);

      if (userData.role === "admin") {
        navigate("/report-admin");
      } else {
        navigate("/report");
      }

      setSuccessMessage("Login berhasil!");
    } catch (error) {
      setErrorMessage("Login gagal: " + error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="container max-w-sm mx-auto min-h-screen flex items-center justify-center">
      <div className="bg-sky-600 bg shadow-md rounded-md px-8 py-9 w-full">
        {errorMessage && (
          <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
            <Alert variant="filled" severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>
          </Stack>)}
          {
            successMessage && (
              <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
                <Alert iconMapping={{ success: <CheckIcon fontSize="inherit" /> }} variant="filled" severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
              </Stack>)
          }
        <h2 className="text-4xl font-bold text-center text-white mb-7">Login</h2>
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
