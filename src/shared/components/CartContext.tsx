import { createContext } from "react";
import type { CartContextType } from "./CartTypes";

export const CartContext =
  createContext<CartContextType | undefined>(undefined);