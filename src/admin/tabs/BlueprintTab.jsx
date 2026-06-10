/**
 * @file BlueprintTab.jsx
 * @description CRUD interface for the AQA Foundation Paper 1 blueprint slots.
 */
import { useState, useEffect } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';

const EMPTY = { q_ref: '', topic: '', style: '', marks: 1, sort_order: 0 };

export default function BlueprintTab() {
    const [rows,   setRows]   = useState([]);
    const [loading,setLoading]= useState(true);
    const [modal,  setModal]  = useState(null);
    const [form,   setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() { setLoading(true); setRows(await fetchResource('blueprint')); setLoading(false); }
    function openAdd()     { setForm(EMPTY); setModal('add'); }
    function openEdit(row) { setForm({ q_ref: row.q_ref, topic: row.topic, style: row.style, marks: row.marks, sort_order: row.sort_order }); setModal(row); }
    function close()       { setModal(null); }

    async function save() {
        setSaving(true);
        try {
            modal === 'add' ? await createResource('blueprint', form) : await updateResource('blueprint', modal.id, form);
            await load(); close();
        } catch { /* silent */ }
        setSaving(false);
    }

    async function remove(id) {
        if (!confirm('Delete this blueprint slot?')) return;
        await deleteResource('blueprint', id);
        load();
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>AQA Foundation Paper 1 Blueprint</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} slots</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add slot</button>
            </div>
            <p style={{ color: 'var(--slate)', fontSize: '.8rem', marginBottom: 16 }}>
                These slots define the question style used in Real Paper Mode for AQA. The AI generates fresh questions matching each slot's topic and style descriptor.
            </p>
            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead><tr><th>Q ref</th><th>Topic</th><th>Style descriptor</th><th>Marks</th><th>Actions</th></tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id}>
                                <td><span style={{ background: 'rgba(245,200,66,.12)', color: 'var(--gold)', borderRadius: 4, padding: '2px 8px', fontSize: '.8rem', fontWeight: 600 }}>{r.q_ref}</span></td>
                                <td style={{ fontSize: '.82rem' }}>{r.topic}</td>
                                <td style={{ fontSize: '.78rem', color: 'var(--slate)', maxWidth: 260 }}>{r.style.slice(0, 80)}{r.style.length > 80 ? '…' : ''}</td>
                                <td style={{ color: 'var(--gold)' }}>{r.marks}</td>
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
                        <h3>{modal === 'add' ? 'Add blueprint slot' : 'Edit blueprint slot'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="admin-field">
                                <label>Question ref (e.g. Q1)</label>
                                <input value={form.q_ref} onChange={e => setForm(f => ({ ...f, q_ref: e.target.value }))} />
                            </div>
                            <div className="admin-field">
                                <label>Marks</label>
                                <input type="number" min="1" max="20" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: +e.target.value }))} />
                            </div>
                        </div>
                        <div className="admin-field">
                            <label>Topic</label>
                            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
                        </div>
                        <div className="admin-field">
                            <label>Style descriptor (tells the AI how to generate the question)</label>
                            <textarea rows={4} value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} />
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
