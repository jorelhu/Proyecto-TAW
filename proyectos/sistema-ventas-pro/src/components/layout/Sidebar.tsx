import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white p-6">
      <h2 className="text-xl font-bold mb-10">ProdOffice</h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-700"
                : "hover:bg-blue-800 text-blue-100"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-700"
                : "hover:bg-blue-800 text-blue-100"
            }`
          }
        >
          📦 Productos
        </NavLink>
      </nav>
    </aside>
  );
}