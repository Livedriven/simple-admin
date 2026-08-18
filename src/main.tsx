import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/app.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Não foi possível inicializar a aplicação.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
