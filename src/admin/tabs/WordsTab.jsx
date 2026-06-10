/**
 * @file WordsTab.jsx
 * @description CRUD interface for the Word Scramble vocabulary list.
 */
import { useState, useEffect } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';

const EMPTY = { word: '', clue: '', subject: 'English', sort_order: 0 };

export default function WordsTab() {
    const [rows,   setRows]   = useState([]);
    const [loading,setLoading]= useState(true);
    const [modal,  setModal]  = useState(null);
    const [form,   setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() { setLoading(true); setRows(await fetchResource('words')); setLoading(false); }
    function openAdd()     { setForm(EMPTY); setModal('add'); }
    function openEdit(row) { setForm({ word: row.word, clue: row.clue, subject: row.subject, sort_order: row.sort_order }); setModal(row); }
    function close()       { setModal(null); }

    async function save() {
        setSaving(true);
        try {
            modal === 'add' ? await createResource('words', form) : await updateResource('words', modal.id, form);
            await load(); close();
        } catch { /* silent */ }
        setSaving(false);
    }

    async function remove(id) {
        if (!confirm('Delete this word?')) return;
        await deleteResource('words', id);
        load();
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Word Scramble Vocabulary</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} words</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add word</button>
            </div>
            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead><tr><th>Word</th><th>Subject</th><th>Clue</th><th>Actions</th></tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600, letterSpacing: '.04em' }}>{r.word}</td>
                                <td><span style={{ background: 'rgba(167,139,250,.12)', color: 'var(--purple)', borderRadius: 4, padding: '2px 6px', fontSize: '.75rem' }}>{r.subject}</span></td>
                                <td style={{ fontSize: '.82rem', color: 'var(--slate)' }}>{r.clue}</td>
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
                        <h3>{modal === 'add' ? 'Add word' : 'Edit word'}</h3>
                        <div className="admin-field">
                            <label>Word (uppercase)</label>
                            <input value={form.word} onChange={e => setForm(f => ({ ...f, word: e.target.value.toUpperCase() }))} />
                        </div>
                        <div className="admin-field">
                            <label>Subject</label>
                            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                                <option>English</option>
                                <option>Literature</option>
                                <option>Maths</option>
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Clue</label>
                            <textarea rows={2} value={form.clue} onChange={e => setForm(f => ({ ...f, clue: e.target.value }))} />
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
