/**
 * @file main.jsx
 * @description React 18 entry point. Routes to AdminApp for /admin paths, main App otherwise.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import App from './App';
import AdminApp from './admin/AdminApp';

const isAdmin = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {isAdmin ? <AdminApp /> : <App />}
    </StrictMode>
);
