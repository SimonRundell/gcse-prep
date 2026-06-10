/**
 * @file AdminLogin.jsx
 * @description Login form and first-run setup form for the admin section.
 */
import { useState } from 'react';
import { adminLogin, adminSetup } from '../api/resources';

/**
 * @param {{ hasAdmin: boolean, onSuccess: () => void }} props
 */
export default function AdminLogin({ hasAdmin, onSuccess }) {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [confirm,  setConfirm]  = useState('');
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);

    async function submit(e) {
        e.preventDefault();
        setError('');
        if (!hasAdmin && password !== confirm) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            if (hasAdmin) {
                await adminLogin(email, password);
            } else {
                await adminSetup(email, password);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    }

    return (
        <div className="admin-login-wrap">
            <div className="admin-login-card">
                <div className="admin-logo" style={{ marginBottom: 20 }}>
                    GCSE<span>Prep</span> <span style={{ color: 'var(--slate)', fontWeight: 400, fontSize: '.85rem' }}>Admin</span>
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1rem' }}>
                    {hasAdmin ? 'Sign in' : 'Create admin account'}
                </h2>
                <p style={{ margin: '0 0 20px', fontSize: '.8rem', color: 'var(--slate)' }}>
                    {hasAdmin ? 'GCSEPrep administration panel' : 'First-time setup — create your admin credentials'}
                </p>
                <form onSubmit={submit}>
                    <div className="admin-field">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                    </div>
                    <div className="admin-field">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                    </div>
                    {!hasAdmin && (
                        <div className="admin-field">
                            <label>Confirm password</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                        </div>
                    )}
                    {error && <p style={{ color: 'var(--coral)', fontSize: '.82rem', margin: '0 0 12px' }}>{error}</p>}
                    <button type="submit" className="btn-add" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Please wait…' : hasAdmin ? 'Sign in' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
