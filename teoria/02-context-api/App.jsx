import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { Navbar } from './Navbar';
import { MainContent } from './MainContent';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />
        <MainContent />
      </div>
    </ThemeProvider>
  );
}
