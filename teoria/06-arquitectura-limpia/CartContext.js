import React, { createContext, useReducer } from 'react';
import { cartReducer, initialCartState } from './cartReducer';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Inyectamos el estado crudo y el despachador en el contexto
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
