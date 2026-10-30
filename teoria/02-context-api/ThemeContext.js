import React, { createContext, useState, useContext } from 'react';

// 1. Inicializamos el contexto
const ThemeContext = createContext();

// 2. Creamos el proveedor que manejará el estado global
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Estado global

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Pasamos el estado y la función para cambiarlo dentro de la propiedad "value"
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Hook personalizado para consumir este contexto fácilmente
export function useTheme() {
  return useContext(ThemeContext);
}
