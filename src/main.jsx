/**
 * @file main.jsx
 * @description React 18 entry point. Single page application — all routing is state-driven.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import App from './App';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
