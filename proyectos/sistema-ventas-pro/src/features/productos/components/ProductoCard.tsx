import type { Producto } from "../types";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{producto.nombre}</h3>
      <p>Precio: ${producto.precio}</p>
    </div>
  );
}