import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import Stack from "@mui/material/Stack";
import { CheckIcon } from "@heroicons/react/16/solid";

export const EvaluationForm = () => {
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Ambil daftar karyawan yang bisa dinilai
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/create-user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        const filtered = (data.users || data.data || []).filter((u) => u.role === "karyawan");
        setEmployees(filtered);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchEmployees();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      ...form,
      discipline: Number(form.discipline),
      responsibility: Number(form.responsibility),
      initiative: Number(form.initiative),
      teamwork: Number(form.teamwork),
      field_score: Number(form.field_score),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/evaluations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal kirim penilaian");
      }

      setSuccessMessage("Penilaian berhasil dikirim!");
      setForm({
        employee_id: "",
        discipline: "",
        responsibility: "",
        initiative: "",
        teamwork: "",
        field_score: "",
        notes: "",
      });
    } catch (error) {
      setErrorMessage("Gagal mengirim penilaian: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
        {successMessage && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="success">
            <CheckIcon />
            {successMessage}
          </Alert>
        </Stack>
      )}
      {errorMessage && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}
      <h2 className="text-2xl font-bold mb-4">Form Penilaian Karyawan</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilih Karyawan */}
        <div>
          <label className="block font-medium mb-1">Pilih Karyawan</label>
          <select name="employee_id" value={form.employee_id} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">-- Pilih --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
            <label className="block font-medium mb-1">Bulan</label><input type="month" name="month" value={form.month} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
        </div>

        {/* Grid Input Nilai (2 kolom di layar besar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["discipline", "responsibility", "initiative", "teamwork", "field_score"].map((field) => (
            <div key={field}>
              <label className="block capitalize font-medium mb-1">{field.replace("_", " ")}</label>
              <input type="number" name={field} value={form[field]} onChange={handleChange} required min={1} max={100} className="w-full border px-3 py-2 rounded" />
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium mb-1">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full border px-3 py-2 rounded" />
        </div>

        {/* Submit */}
        <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">
          Kirim Penilaian
        </button>
      </form>
    </div>
  );
};
