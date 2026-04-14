export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">Bienvenido</div>
        <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
          A
        </div>
      </div>
    </header>
  );
}