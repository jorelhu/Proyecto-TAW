import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productosService";
import type { Producto } from "../types";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerProductos().then(setProductos);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Productos</h2>
          <p className="text-sm text-gray-500">Gestiona tu inventario</p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition">
          + Nuevo producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Precio</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition"
              >
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

