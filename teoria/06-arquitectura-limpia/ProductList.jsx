import React from 'react';
import { useCart } from './useCart';

const PRODUCTS = [
  { id: 'p1', name: 'Smartphone Pro', price: 899 },
  { id: 'p2', name: 'Auriculares ANC', price: 199 },
];

export function ProductList() {
  const { addItem } = useCart(); // Solo consume la acción que necesita

  return (
    <section>
      <h2>Productos Disponibles</h2>
      {PRODUCTS.map(product => (
        <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '8px' }}>
          <strong>{product.name}</strong> - ${product.price}
          <button onClick={() => addItem(product)} style={{ marginLeft: '10px' }}>
            Añadir al Carrito
          </button>
        </div>
      ))}
    </section>
  );
}
