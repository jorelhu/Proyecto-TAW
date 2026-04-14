export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Resumen general de tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Ventas del día</p>
            <h3 className="text-2xl font-bold mt-2 text-blue-700">$1,250</h3>
          </div>
          <span className="text-blue-500">↑</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-slate-500">Productos vendidos</p>
          <h3 className="text-2xl font-bold mt-2 text-blue-700">32</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-slate-500">Clientes</p>
          <h3 className="text-2xl font-bold mt-2 text-blue-700">18</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="font-semibold mb-4 text-slate-700">
          Actividad reciente
        </h3>

        <ul className="space-y-3 text-sm text-slate-600">
          <li>🛒 Venta realizada - $50</li>
          <li>📦 Producto agregado - "Rosa Premium"</li>
          <li>👤 Nuevo cliente registrado</li>
        </ul>
      </div>
    </div>
  );
}