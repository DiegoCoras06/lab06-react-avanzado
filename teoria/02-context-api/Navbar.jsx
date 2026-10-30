import React from 'react';
import { ThemeButton } from './ThemeButton';

// Componente intermedio: NO recibe props del tema (evita el "prop drilling").
// La guía no lo incluye; se agrega para que el ejemplo sea ejecutable.
export function Navbar() {
  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
      <strong>Mi Sitio</strong> <ThemeButton />
    </nav>
  );
}
