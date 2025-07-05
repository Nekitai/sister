import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import Stack from "@mui/material/Stack";
import { CheckIcon } from "@heroicons/react/16/solid";

export const AdminReport = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Move fetchUsers to component scope so it can be used elsewhere
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
      setUsers(data.users); // Pastikan Laravel mengirim key `users`
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
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
      fetchUsers();
    } catch (error) {
      setErrorMessage("Gagal menghapus user: " + error.message);
    }
  };

  return (
    <div className="p-6 w-full">
      {errorMessage && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}
      {successMessage && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}
      <h2 className="text-2xl font-bold mb-4">Daftar Pengguna</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto border border-gray-200 shadow-2xl">
          <thead className="bg-sky-500 text-white font-semibold text-left">
            <tr>
              <th className="px-4 py-2 text-left w-[150px]">#</th>
              <th className="px-4 py-2 text-left w-[150px]">Nama</th>
              <th className="px-4 py-2 text-left w-[150px]">Username</th>
              <th className="px-4 py-2 text-left w-[150px]">Role</th>
              <th className="px-4 py-2 text-left w-[150px]">Departemen</th>
              <th className="px-4 py-2 text-left w-[150px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.filter((user) => user.role !== "admin").length > 0 ? (
              users
                .filter((user) => user.role !== "admin")
                .map((user, index) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.department?.name || "-"}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(user.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
