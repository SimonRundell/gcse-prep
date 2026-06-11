/**
 * @file AdminUsersTab.jsx
 * @description CRUD interface for admin users. Logged-in admins can create, edit
 *              and delete other admin accounts. Deleting your own account and
 *              deleting the last remaining account are blocked server-side.
 */
import { useState, useEffect } from 'react';
import { listAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../api/resources';

const EMPTY = { email: '', password: '', confirm: '' };

export default function AdminUsersTab() {
    const [rows,    setRows]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal,   setModal]   = useState(null);   // null | 'add' | row object
    const [form,    setForm]    = useState(EMPTY);
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setRows(await listAdminUsers().catch(() => []));
        setLoading(false);
    }

    function openAdd()     { setForm(EMPTY); setError(''); setModal('add'); }
    function openEdit(row) { setForm({ email: row.email, password: '', confirm: '' }); setError(''); setModal(row); }
    function close()       { setModal(null); setError(''); }

    function field(key, value) { setForm(f => ({ ...f, [key]: value })); }

    async function save() {
        setError('');
        const { email, password, confirm } = form;
        if (!email) return setError('Email is required');
        if (modal === 'add' && !password) return setError('Password is required');
        if (password && password.length < 8) return setError('Password must be at least 8 characters');
        if (password && password !== confirm) return setError('Passwords do not match');

        setSaving(true);
        try {
            if (modal === 'add') {
                await createAdminUser(email, password);
            } else {
                await updateAdminUser(modal.id, email, password);
            }
            await load();
            close();
        } catch (e) {
            setError(e?.response?.data?.error || 'Save failed');
        }
        setSaving(false);
    }

    async function remove(row) {
        if (!confirm(`Delete admin account for ${row.email}?`)) return;
        try {
            await deleteAdminUser(row.id);
            load();
        } catch (e) {
            alert(e?.response?.data?.error || 'Delete failed');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Admin Users</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} account{rows.length !== 1 ? 's' : ''}</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add admin</button>
            </div>

            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.email}</td>
                                <td style={{ color: 'var(--slate)', fontSize: '.82rem' }}>
                                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="btn-edit"   onClick={() => openEdit(r)}>Edit</button>
                                        <button className="btn-delete" onClick={() => remove(r)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
                    <div className="admin-modal">
                        <h3>{modal === 'add' ? 'Add admin user' : 'Edit admin user'}</h3>

                        <div className="admin-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => field('email', e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="admin-field">
                            <label>{modal === 'add' ? 'Password' : 'New password (leave blank to keep current)'}</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => field('password', e.target.value)}
                                placeholder={modal === 'add' ? 'Min. 8 characters' : 'Leave blank to keep current'}
                            />
                        </div>

                        {(modal === 'add' || form.password) && (
                            <div className="admin-field">
                                <label>Confirm password</label>
                                <input
                                    type="password"
                                    value={form.confirm}
                                    onChange={e => field('confirm', e.target.value)}
                                    placeholder="Repeat password"
                                />
                            </div>
                        )}

                        {error && (
                            <p style={{ color: 'var(--coral)', fontSize: '.82rem', marginBottom: 10 }}>{error}</p>
                        )}

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                            <button
                                onClick={close}
                                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--slate)', padding: '7px 16px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button className="btn-add" onClick={save} disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
