import React, { useEffect, useState } from "react";

export const AdminReport = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
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

    fetchUsers();
  }, []);

  

  return (
    <div className="p-6 w-full">
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
          <tbody>
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
                      <button className="text-red-600 hover:underline">Hapus</button>
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
