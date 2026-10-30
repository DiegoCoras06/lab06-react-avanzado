import React from 'react';
import { useCart } from './useCart';

export function CartWidget() {
  // El componente obtiene datos procesados y listos para renderizar
  const { cart, totalItems, totalPrice, removeItem, clearCart } = useCart();

  if (cart.length === 0) return <p>El carrito está vacío 🛒</p>;

  return (
    <aside style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
      <h3>Tu Carrito ({totalItems} productos)</h3>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} x{item.quantity} - ${item.price * item.quantity}
            <button onClick={() => removeItem(item.id)} style={{ marginLeft: '8px', color: 'red' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h4>Total a Pagar: ${totalPrice}</h4>
      <button onClick={clearCart} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
        Vaciar Todo el Carrito
      </button>
    </aside>
  );
}
