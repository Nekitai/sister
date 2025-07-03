import React, { useEffect, useState } from "react";

export const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");

  // Ambil data departemen
  const fetchDepartments = React.useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDepartments(data.departments || data.data || data);
      console.log("Data dari API:", data);
    } catch (error) {
      console.error("Gagal mengambil data departemen:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [fetchDepartments, token]);

  const handleAddDepartment = async () => {
    if (!name.trim()) {
      alert("Nama departemen wajib diisi.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/departments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menambahkan departemen");
      }

      alert("Departemen berhasil ditambahkan!");
      setName(""); // reset input
      fetchDepartments(); // refresh list
    } catch (error) {
      alert("Gagal menambahkan: " + error.message);
    }
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Manajemen Departemen</h2>

      {/* FORM TAMBAH */}
      <div className="mb-4 flex items-center gap-2">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border px-4 py-2 rounded w-full" placeholder="Nama Departemen" />
        <button onClick={handleAddDepartment} className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
          Tambah
        </button>
      </div>

      {/* TABEL */}
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-sky-500 text-white">
            <th className="border px-4 py-2">Nama Departemen</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((dept) => (
              <tr key={dept.id}>
                <td className="border px-4 py-2">{dept.name}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-500">Edit</button>
                  <button className="text-red-500 ml-2">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={2}>
                Tidak ada data departemen.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
