export default function ProductosPage() {
  const productos = [
    { id: 1, nombre: "Rosa", precio: 10 },
    { id: 2, nombre: "Tulipán", precio: 8 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
          <p className="text-sm text-slate-500">
            Gestiona tu inventario
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition">
          + Nuevo producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-4 font-medium">{p.id}</td>
                <td className="p-4">{p.nombre}</td>
                <td className="p-4 text-blue-600 font-semibold">
                  ${p.precio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
