import type { Producto } from "../types";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{producto.nombre}</h3>
      <p>Precio: ${producto.precio}</p>
    </div>
  );
}