import React, { useEffect, useState } from "react";

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

  const token = localStorage.getItem("token");

  // Ambil data users dan departemen
  // Fetch users function moved outside useEffect for reuse
  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/create-user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Data dari API:", data);
      setUsers(data.users || data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  }, [token]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDepartments(data.departments || data);
      } catch (error) {
        console.error("Gagal mengambil data departemen:", error);
      }
    };

    fetchUsers();
    fetchDepartments();
  }, [token, fetchUsers]);

  // Handle input perubahan form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form tambah user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      alert("User berhasil ditambahkan!");
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
      alert("Gagal menambahkan user: " + error.message);
    }
  };
  const handleDelete = async (id) => {
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

      alert("User berhasil dihapus!");
      fetchUsers(); // error
    } catch (error) {
      alert("Gagal menghapus user: " + error.message);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Manajemen Pengguna</h2>

      {/* FORM TAMBAH USER */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded mb-6">
        <div>
          <label className="block font-medium mb-1">Nama</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Password Confirmation</label>
          <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select name="role" value={form.role} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
            <option value="">-- Pilih Role --</option>
            <option value="hrd">HRD</option>
            <option value="spv">Supervisor</option>
            <option value="karyawan">Karyawan</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Departemen</label>
          <select name="department_id" value={form.department_id} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="">-- Pilih Departemen --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
          + Tambah User
        </button>
      </form>

      {/* TABEL USER YANG SUDAH ADA */}
      <table className="min-w-full bg-white border rounded shadow-2xl text-center">
        <thead>
          <tr className="bg-sky-500 text-white border-2">
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Devisi</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Aksi</th>
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
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(user.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={6}>
                Tidak ada data user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
