import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Definimos un estado inicial para saber si hay un error
    this.state = { hasError: false, errorLog: '' };
  }

  // 1. Este método actualiza el estado para que el siguiente renderizado
  // muestre la interfaz alternativa
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 2. Este método se usa para registrar el error en Sentry, LogRocket, etc.
  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por el Boundary:", error, errorInfo);
    this.setState({ errorLog: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      // Interfaz alternativa que ve el usuario en lugar de la pantalla en blanco
      return (
        <div style={{ padding: '20px', border: '2px solid red', borderRadius: '5px', backgroundColor: '#fff5f5' }}>
          <h3>⚠️ Algo salió mal en esta sección</h3>
          <p>La aplicación sigue funcionando, pero este componente falló.</p>
          <button onClick={() => this.setState({ hasError: false })}>Reintentar</button>
        </div>
      );
    }

    // Si no hay error, renderiza los componentes hijos normalmente
    return this.props.children;
  }
}
