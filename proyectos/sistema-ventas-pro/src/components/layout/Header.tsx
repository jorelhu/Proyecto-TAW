export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg text-slate-700">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Admin</span>
        <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold">
          A
        </div>
      </div>
    </header>
  );
}