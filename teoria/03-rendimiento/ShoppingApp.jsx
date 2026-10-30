import React, { useState, useMemo, useCallback } from 'react';
import { ProductItem } from './ProductItem';

export function ShoppingApp() {
  const [products] = useState([
    { id: 1, name: 'Laptop Gamers', price: 1200 },
    { id: 2, name: 'Mouse Óptico', price: 40 },
    { id: 3, name: 'Teclado Mecánico', price: 100 }
  ]);

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(''); // Estado secundario (ej. texto de un input)

  // 1. useMemo: Memoriza el valor total.
  // Solo se vuelve a calcular si el 'cart' cambia.
  // Escribir en el input del cupón NO afectará este cálculo.
  const totalCost = useMemo(() => {
    console.log('Calculando costo total...');
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  // 2. useCallback: Memoriza la definición de la función.
  // Mantiene la misma referencia en memoria.
  // Si no lo usáramos, 'ProductItem' se re-renderizaría siempre
  // porque detectaría una función 'onAdd' "nueva" en cada render del padre.
  const handleAddToCart = useCallback((product) => {
    setCart((prevCart) => [...prevCart, product]);
  }, []); // Dependencias vacías: la función conserva la misma referencia siempre

  return (
    <div>
      <h2>Tienda Tecnológica</h2>

      {/* Input de prueba: Cambiar este estado no activa useMemo ni re-renders de los hijos */}
      <input
        type="text"
        placeholder="Código de cupón"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />

      <h3>Costo Total del Carrito: ${totalCost}</h3>

      <div>
        {products.map(product => (
          <ProductItem
            key={product.id}
            product={product}
            onAdd={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
