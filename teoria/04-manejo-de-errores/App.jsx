import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { WeatherWidget } from './WeatherWidget';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Principal</h1>
      <p>Esta barra de navegación superior siempre estará visible y a salvo.</p>
      <hr />

      {/* Aislamos el widget del clima dentro de nuestro Error Boundary */}
      <ErrorBoundary>
        <WeatherWidget />
      </ErrorBoundary>

      <hr />

      <div>
        <h3>Sección de Noticias</h3>
        <p>Este contenido sigue totalmente interactivo aunque el clima falle.</p>
      </div>
    </div>
  );
}
