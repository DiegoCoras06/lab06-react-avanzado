import React from 'react';
import { useTheme } from './ThemeContext';

export function ThemeButton() {
  // Extraemos los datos globales directamente sin usar props
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
        padding: '10px 20px',
        border: '1px solid #ccc',
        cursor: 'pointer'
      }}
    >
      Cambiar a modo {theme === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}
    </button>
  );
}
