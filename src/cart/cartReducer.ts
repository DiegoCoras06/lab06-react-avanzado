// ============================================================
// CAPA DE DOMINIO — Estado, acciones y reducer (JavaScript/TS puro)
// No conoce React, ni localStorage, ni alert(): es 100% testeable.
// ============================================================

// --- TIPOS DE DATOS ---
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  /** Código de descuento aplicado (null si no hay ninguno) */
  discountCode: string | null;
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Omit<CartItem, 'quantity'>; stock: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'DECREASE_QUANTITY'; payload: { id: string } }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'CLEAR_CART' };

// --- DESCUENTOS (tarea del laboratorio) ---
/** Catálogo de cupones: código -> porcentaje (0.10 = 10 %) */
export const DISCOUNT_CODES: Readonly<Record<string, number>> = {
  ESTUDIANTE10: 0.1,
};

/** Normaliza lo que escribe el usuario: " estudiante10 " -> "ESTUDIANTE10" */
export const normalizeCode = (code: string): string => code.trim().toUpperCase();

export const isValidDiscountCode = (code: string): boolean =>
  Object.prototype.hasOwnProperty.call(DISCOUNT_CODES, normalizeCode(code));

export const initialCartState: CartState = { items: [], discountCode: null };

// --- REDUCER (inmutable: nunca se muta el estado anterior) ---
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, stock } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      // VALIDACIÓN DE STOCK: si ya alcanzó el límite, devolvemos el MISMO estado
      if (currentQty >= stock) return state;

      if (existing) {
        // map() crea un arreglo nuevo y un objeto nuevo solo para el ítem modificado
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return { ...state, items: [...state.items, { ...product, quantity: 1 }] };
    }

    case 'DECREASE_QUANTITY': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (!existing) return state;

      if (existing.quantity > 1) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        };
      }
      // Si la cantidad llega a 0, se elimina automáticamente
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };

    case 'APPLY_DISCOUNT': {
      if (!isValidDiscountCode(action.payload.code)) return state; // código inválido: sin cambios
      const code = normalizeCode(action.payload.code);
      if (state.discountCode === code) return state; // ya aplicado
      return { ...state, discountCode: code };
    }

    case 'REMOVE_DISCOUNT':
      return state.discountCode === null ? state : { ...state, discountCode: null };

    case 'CLEAR_CART':
      return { items: [], discountCode: null };

    default:
      return state;
  }
}

// --- SELECTORES (estados derivados: no se guardan, se calculan) ---
const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export interface CartTotals {
  count: number;
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  total: number;
}

export function selectTotals(state: CartState): CartTotals {
  const count = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = round2(state.items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  const discountRate = state.discountCode ? (DISCOUNT_CODES[state.discountCode] ?? 0) : 0;
  const discountAmount = round2(subtotal * discountRate);
  return { count, subtotal, discountRate, discountAmount, total: round2(subtotal - discountAmount) };
}
