import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles/globals.css';

/* The deployed site uses real paths. The single-file build (npm run
   build:standalone) has no server to rewrite them, so it routes on the
   hash instead — same app, same code, one shareable .html file. */
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
