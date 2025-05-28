import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ImportantInfo from "../components/ImportantInfo";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nisn: "",
    name: "",
    birthPlace: "",
    birthDate: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 px-4 py-2">
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nisn"
                placeholder="NISN"
                value={formData.nisn}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="birthPlace"
                placeholder="Tempat Lahir"
                value={formData.birthPlace}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Daftar
              </button>
            </form>

            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

            <p className="mt-6 text-sm text-center">
              Sudah punya akun?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Login di sini
              </a>
            </p>
          </div>
        </div>
        <ImportantInfo />
      </main>
    </>
  );
}

export default Register;
