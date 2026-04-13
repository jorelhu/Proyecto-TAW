import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productosService";
import type { Producto } from "../types";
import ProductoCard from "../components/ProductoCard";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerProductos().then(setProductos);
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      {productos.map((p) => (
        <ProductoCard key={p.id} producto={p} />
      ))}
    </div>
  );
}