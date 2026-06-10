/**
 * @file VideosTab.jsx
 * @description CRUD interface for video channel listings.
 */
import { useState, useEffect } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';

const EMPTY = { subject: 'maths', name: '', emoji: '', bg: '', url: '', description: '', topics: [], sort_order: 0 };

export default function VideosTab() {
    const [rows,   setRows]   = useState([]);
    const [loading,setLoading]= useState(true);
    const [modal,  setModal]  = useState(null);
    const [form,   setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [topicsText, setTopicsText] = useState('');

    useEffect(() => { load(); }, []);

    async function load() { setLoading(true); setRows(await fetchResource('videos')); setLoading(false); }

    function openAdd() { setForm(EMPTY); setTopicsText(''); setModal('add'); }
    function openEdit(row) {
        const f = { subject: row.subject, name: row.name, emoji: row.emoji || '', bg: row.bg || '', url: row.url, description: row.description || '', topics: row.topics || [], sort_order: row.sort_order };
        setForm(f);
        setTopicsText((row.topics || []).join('\n'));
        setModal(row);
    }
    function close() { setModal(null); }

    async function save() {
        setSaving(true);
        const payload = { ...form, topics: topicsText.split('\n').map(t => t.trim()).filter(Boolean) };
        try {
            modal === 'add' ? await createResource('videos', payload) : await updateResource('videos', modal.id, payload);
            await load(); close();
        } catch { /* silent */ }
        setSaving(false);
    }

    async function remove(id) {
        if (!confirm('Delete this channel?')) return;
        await deleteResource('videos', id);
        load();
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Video Channels</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} channels</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add channel</button>
            </div>
            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead><tr><th>Subject</th><th>Name</th><th>URL</th><th>Topics</th><th>Actions</th></tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id}>
                                <td><span style={{ fontSize: '.75rem', background: 'rgba(0,201,167,.1)', color: 'var(--teal)', borderRadius: 4, padding: '2px 6px' }}>{r.subject}</span></td>
                                <td>{r.emoji} {r.name}</td>
                                <td style={{ fontSize: '.78rem', color: 'var(--slate)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</td>
                                <td style={{ fontSize: '.78rem', color: 'var(--slate)' }}>{(r.topics || []).length} topics</td>
                                <td><div className="admin-actions">
                                    <button className="btn-edit"   onClick={() => openEdit(r)}>Edit</button>
                                    <button className="btn-delete" onClick={() => remove(r.id)}>Delete</button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
                    <div className="admin-modal">
                        <h3>{modal === 'add' ? 'Add channel' : 'Edit channel'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="admin-field">
                                <label>Subject</label>
                                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                                    <option value="maths">Maths</option>
                                    <option value="english">English</option>
                                </select>
                            </div>
                            <div className="admin-field">
                                <label>Emoji</label>
                                <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
                            </div>
                        </div>
                        <div className="admin-field">
                            <label>Channel name</label>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="admin-field">
                            <label>URL</label>
                            <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
                        </div>
                        <div className="admin-field">
                            <label>Background colour (CSS value)</label>
                            <input value={form.bg} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))} placeholder="e.g. rgba(245,200,66,.12)" />
                        </div>
                        <div className="admin-field">
                            <label>Description</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="admin-field">
                            <label>Topics (one per line)</label>
                            <textarea rows={5} value={topicsText} onChange={e => setTopicsText(e.target.value)} placeholder="Fractions&#10;Percentages&#10;Ratio" />
                        </div>
                        <div className="admin-field">
                            <label>Sort order</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                            <button onClick={close} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--slate)', padding: '7px 16px', cursor: 'pointer' }}>Cancel</button>
                            <button className="btn-add" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
