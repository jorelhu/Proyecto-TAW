import type { Producto } from "../types";

export const obtenerProductos = async (): Promise<Producto[]> => {
  return [
    { id: 1, nombre: "Rosa", precio: 10 },
    { id: 2, nombre: "Tulipán", precio: 8 },
  ];
};