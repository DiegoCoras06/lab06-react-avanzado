import { describe, expect, it } from 'vitest';
import { cartReducer, initialCartState, selectTotals, type CartState } from './cartReducer';

const shoes = { id: 'p1', name: 'Zapatillas Running', price: 100 };
const bag = { id: 'p2', name: 'Mochila', price: 50 };

const add = (s: CartState, p = shoes, stock = 5) =>
  cartReducer(s, { type: 'ADD_TO_CART', payload: { product: p, stock } });

describe('cartReducer', () => {
  it('agrega un producto nuevo con cantidad 1', () => {
    const s = add(initialCartState);
    expect(s.items).toEqual([{ ...shoes, quantity: 1 }]);
  });

  it('incrementa la cantidad sin mutar el estado anterior', () => {
    const s1 = add(initialCartState);
    const s2 = add(s1);
    expect(s2.items[0].quantity).toBe(2);
    expect(s1.items[0].quantity).toBe(1); // inmutabilidad
    expect(s2.items).not.toBe(s1.items);
  });

  it('respeta el stock máximo', () => {
    const s1 = add(initialCartState, shoes, 1);
    const s2 = add(s1, shoes, 1);
    expect(s2).toBe(s1);
  });

  it('disminuye y elimina al llegar a 0', () => {
    const s2 = add(add(initialCartState));
    const s3 = cartReducer(s2, { type: 'DECREASE_QUANTITY', payload: { id: 'p1' } });
    expect(s3.items[0].quantity).toBe(1);
    const s4 = cartReducer(s3, { type: 'DECREASE_QUANTITY', payload: { id: 'p1' } });
    expect(s4.items).toHaveLength(0);
  });

  it('elimina y limpia el carrito', () => {
    const s = add(add(initialCartState), bag);
    expect(cartReducer(s, { type: 'REMOVE_FROM_CART', payload: { id: 'p1' } }).items).toHaveLength(1);
    expect(cartReducer(s, { type: 'CLEAR_CART' })).toEqual(initialCartState);
  });
});

describe('applyDiscount (ESTUDIANTE10)', () => {
  const withItems = add(add(initialCartState), bag); // 100 + 50 = 150

  it('aplica 10 % con el código correcto', () => {
    const s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: 'ESTUDIANTE10' } });
    expect(s.discountCode).toBe('ESTUDIANTE10');
    expect(selectTotals(s)).toMatchObject({ subtotal: 150, discountAmount: 15, total: 135 });
  });

  it('acepta minúsculas y espacios', () => {
    const s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: '  estudiante10 ' } });
    expect(s.discountCode).toBe('ESTUDIANTE10');
  });

  it('rechaza códigos inválidos sin cambiar el estado', () => {
    const s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: 'FALSO' } });
    expect(s).toBe(withItems);
    expect(selectTotals(s).total).toBe(150);
  });

  it('es inmutable: no modifica el estado previo', () => {
    const s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: 'ESTUDIANTE10' } });
    expect(withItems.discountCode).toBeNull();
    expect(s).not.toBe(withItems);
    expect(s.items).toBe(withItems.items); // los ítems se comparten, no se copian
  });

  it('el descuento se mantiene al cambiar cantidades y se borra al vaciar', () => {
    let s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: 'ESTUDIANTE10' } });
    s = add(s); // +100 => 250
    expect(selectTotals(s).total).toBe(225);
    expect(cartReducer(s, { type: 'CLEAR_CART' }).discountCode).toBeNull();
  });

  it('REMOVE_DISCOUNT quita el cupón', () => {
    const s = cartReducer(withItems, { type: 'APPLY_DISCOUNT', payload: { code: 'ESTUDIANTE10' } });
    expect(cartReducer(s, { type: 'REMOVE_DISCOUNT' }).discountCode).toBeNull();
  });
});
