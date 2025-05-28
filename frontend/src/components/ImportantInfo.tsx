const ImportantInfo = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-3">Informasi Penting</h2>
      <div className="text-sm space-y-3 text-gray-700">
        <div>
          <strong>📄 Pengambilan Ijazah</strong>
          <br />
          Pengambilan ijazah dapat dilakukan mulai tanggal{" "}
          <strong>15 Juli 2025</strong> di ruang Tata Usaha MTs YMI Wonopringgo.
        </div>
        <hr />
        <div>
          <strong>🏫 Pendaftaran Sekolah Lanjutan</strong>
          <br />
          Informasi mengenai pendaftaran sekolah lanjutan dapat dilihat di papan
          pengumuman sekolah atau hubungi guru BK.
        </div>
        <hr />
        <div>
          <strong>📞 Kontak</strong>
          <br />
          Untuk informasi lebih lanjut, silakan hubungi sekretariat MTs YMI
          Wonopringgo di <strong>(0285) 123456</strong>.
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ImportantInfo;
