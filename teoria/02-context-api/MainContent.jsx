import React from 'react';
import { useTheme } from './ThemeContext';

// Componente auxiliar (no está en la guía) para que App.jsx sea ejecutable.
export function MainContent() {
  const { theme } = useTheme();
  return (
    <main
      style={{
        padding: 20,
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
      }}
    >
      Contenido principal. Tema actual: {theme}
    </main>
  );
}
