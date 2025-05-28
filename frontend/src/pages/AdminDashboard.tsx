import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_URL } from "../lib/api";

type Student = {
  nisn: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  token: string;
};

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  //   Fetch student
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);

      const res = await axios.get("http://localhost:5000/api/auth/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response data:", res.data);
      setStudents(res.data.students);
    } catch (err: any) {
      console.error(
        "Error fetching students:",
        err.response?.data || err.message
      );
      setMessage(
        err.response?.data?.message || "Failed to fetch students data"
      );
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  //   Filter student
  const filteredStudents = students.filter(
    (s) =>
      s.nisn.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  //   Export xlsx
  const handleExport = () => {
    const exportData = filteredStudents.map((s) => ({
      NISN: s.nisn,
      Nama: s.name,
      TTL: `${s.birthPlace}, ${s.birthDate}`,
      Token: s.token,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `data-siswa-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  //   Import xlsx
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      try {
        const res = await axios.post(
          `${API_URL}/api/auth/import`,
          { students: json },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessage(res.data.message);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Gagal import");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Dashboard Siswa</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Import Siswa dari Excel
        </label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {message && <p className="text-sm text-green-700">{message}</p>}
      </div>
      <div className="overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Cari nama atau NISN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-full max-w-sm"
          />
          <button
            onClick={handleExport}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Export Excel
          </button>
        </div>

        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">NISN</th>
              <th className="p-2">Tempat & Tgl Lahir</th>
              <th className="p-2">Token</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.nisn}</td>
                <td className="p-2">
                  {s.birthPlace}, {s.birthDate}
                </td>
                <td className="p-2 font-mono text-xs">{s.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
