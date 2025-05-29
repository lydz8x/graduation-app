import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import ImportantInfo from "../components/ImportantInfo";
import { API_URL } from "../lib/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nisn: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentName", res.data.student.name);
      localStorage.setItem("studentNisn", res.data.student.nisn);
      localStorage.setItem("birthPlace", res.data.student.birthPlace);
      localStorage.setItem("birthDate", res.data.student.birthDate);
      localStorage.setItem("role", res.data.student.role);

      if (res.data.student.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/download-skl");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };
  return (
    <>
      <Navbar />
      <main className="bg-gray-100 px-4 py-2">
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nisn"
                placeholder="NISN"
                value={formData.nisn}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="Masukkan Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  onClick={() => setShow((prev) => !prev)}
                  tabIndex={-1}
                >
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </form>

            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

            <p className="mt-6 text-sm text-center">
              Belum punya akun?{""}
              <a href="/register" className="text-blue-600 hover:underline">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>
        <ImportantInfo />
      </main>
    </>
  );
}

export default Login;
