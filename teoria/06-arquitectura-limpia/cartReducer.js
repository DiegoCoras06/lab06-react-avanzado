// CAPA DE DOMINIO: lógica pura del estado complejo (versión JavaScript de la guía)

// Definición de acciones de manera estricta
export const CART_ACTIONS = {
  ADD_ITEM: 'cart/addItem',
  REMOVE_ITEM: 'cart/removeItem',
  CLEAR_CART: 'cart/clear',
};

export const initialCartState = {
  items: JSON.parse(localStorage.getItem('ecommerce_cart')) || [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      localStorage.setItem('ecommerce_cart', JSON.stringify(newItems));
      return { ...state, items: newItems };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('ecommerce_cart', JSON.stringify(newItems));
      return { ...state, items: newItems };
    }

    case CART_ACTIONS.CLEAR_CART:
      localStorage.removeItem('ecommerce_cart');
      return { ...state, items: [] };

    default:
      throw new Error(`Acción no soportada: ${action.type}`);
  }
}

// NOTA DEL SENIOR: esta versión es la "didáctica" de la guía. Tiene dos defectos
// que se corrigen en src/cart/cartReducer.ts (versión final del laboratorio):
//   1) `newItems[idx].quantity += 1` MUTA el objeto del estado anterior.
//   2) Escribir en localStorage dentro del reducer es un efecto secundario
//      (el reducer debe ser puro; en StrictMode se ejecuta dos veces).
