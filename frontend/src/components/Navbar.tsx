function Navbar() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              PENGUMUMAN KELULUSAN
            </h1>
            <p className="text-sm text-white/90">
              MTs YMI Wonopringgo Tahun 2025
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
