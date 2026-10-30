import { useContext } from 'react';
import { CartContext } from './CartContext';
import { CART_ACTIONS } from './cartReducer';

export function useCart() {
  const context = useContext(CartContext);

  // Patrón de Salvaguarda: asegura que el hook se use dentro del proveedor correcto
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }

  const { state, dispatch } = context;

  // Acciones encapsuladas (Reglas de aplicación)
  const addItem = (item) => dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  const removeItem = (id) => dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
  const clearCart = () => dispatch({ type: CART_ACTIONS.CLEAR_CART });

  // Selectores de datos optimizados / calculados
  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return {
    cart: state.items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    clearCart,
  };
}
