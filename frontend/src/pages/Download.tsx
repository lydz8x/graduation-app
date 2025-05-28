import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ImportantInfo from "../components/ImportantInfo";

function Download() {
  const [token, setToken] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const studentName = localStorage.getItem("studentName") || "";
  const studentNisn = localStorage.getItem("studentNisn") || "";
  const birthPlace = localStorage.getItem("birthPlace") || "";
  const birthDate = localStorage.getItem("birthDate") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDownloadUrl("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-token",
        { inputToken: token },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDownloadUrl(res.data.downloadUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || "Token salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-gray-100">
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md bg-white p-6 rounded shadow">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-center w-full">
                Hasil Kelulusan
              </h2>
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

            <div className="text-left space-y-3 mb-4">
              <p>
                <strong>Nama</strong>
                <span className="ml-3">: {studentName}</span>
              </p>
              <p>
                <strong>NISN</strong>
                <span className="ml-4">: {studentNisn}</span>
              </p>
              <p>
                <strong>TTL</strong>
                <span className="ml-7">
                  : {birthPlace}, {birthDate}
                </span>
              </p>
            </div>

            <div className="bg-green-100 text-green-800 px-4 py-3 rounded font-bold mb-4">
              SELAMAT! ANDA DINYATAKAN LULUS
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <input
                type="text"
                name="token"
                placeholder="Masukkan Token Kelulusan"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Memverifikasi..." : "Verifikasi Token"}
              </button>
            </form>

            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

            {downloadUrl && (
              <div className="mt-6 text-center">
                <a
                  href={downloadUrl}
                  className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  download
                >
                  Download Surat Keterangan Lulus (SKL)
                </a>
              </div>
            )}
          </div>
        </div>
        <ImportantInfo />
      </main>
    </>
  );
}

export default Download;
