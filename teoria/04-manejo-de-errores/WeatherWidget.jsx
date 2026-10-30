import React from 'react';

// Componente auxiliar (no está en la guía) que FALLA a propósito durante el render,
// para comprobar que el ErrorBoundary aísla el error y el resto de la app sigue viva.
export function WeatherWidget() {
  const weather = undefined;
  return <p>Temperatura: {weather.temp} °C</p>; // TypeError -> lo captura el ErrorBoundary
}
