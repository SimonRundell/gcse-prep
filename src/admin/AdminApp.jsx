/**
 * @file AdminApp.jsx
 * @description Admin root. Checks session on mount then shows Setup, Login, or Dashboard.
 */
import { useState, useEffect } from 'react';
import { checkAdminAuth } from '../api/resources';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

/** @param {{ onBack: () => void }} props */
export default function AdminApp({ onBack }) {
    const [status, setStatus] = useState(null); // null = loading

    useEffect(() => { reload(); }, []);

    function reload() {
        setStatus(null);
        checkAdminAuth().then(setStatus).catch(() => setStatus({ loggedIn: false, hasAdmin: false }));
    }

    if (!status) {
        return (
            <div className="admin-login-wrap">
                <div style={{ color: 'var(--slate)', fontSize: '.9rem' }}>Loading…</div>
            </div>
        );
    }

    if (status.loggedIn) {
        return <AdminDashboard onLogout={reload} onBack={onBack} />;
    }

    return <AdminLogin hasAdmin={status.hasAdmin} onSuccess={reload} />;
}
