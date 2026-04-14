import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-10 text-blue-600">ProdOffice</h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          📦 Productos
        </NavLink>
      </nav>
    </aside>
  );
}