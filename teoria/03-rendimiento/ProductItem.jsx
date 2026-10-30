import React from 'react';

// React.memo evita que este componente se dibuje de nuevo si las props son idénticas
export const ProductItem = React.memo(({ product, onAdd }) => {
  console.log(`Renderizando producto: ${product.name}`);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
      <h4>{product.name} - ${product.price}</h4>
      <button onClick={() => onAdd(product)}>Agregar al carrito</button>
    </div>
  );
});
