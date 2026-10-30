import React from 'react';
import { CartProvider } from './CartContext'; // la guía importa './CartProvider'; el archivo se llama CartContext
import { ProductList } from './ProductList';
import { CartWidget } from './CartWidget';

export default function App() {
  return (
    <CartProvider>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
        <ProductList />
        <CartWidget />
      </div>
    </CartProvider>
  );
}
