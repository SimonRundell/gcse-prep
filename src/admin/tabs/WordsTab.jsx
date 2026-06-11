/**
 * @file WordsTab.jsx
 * @description CRUD interface for the Word Scramble vocabulary list. Rows are
 *              reordered by drag-and-drop (persisted to sort_order); the clue
 *              field uses a rich text editor.
 */
import { useState, useEffect, useRef } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';
import RichTextEditor from '../../components/RichTextEditor';
import { arrayMove, persistOrder } from '../reorder';

const EMPTY = { word: '', clue: '', subject: 'English', sort_order: 0 };

/** Full update payload for a row (the PHP endpoint overwrites every column). */
const toPayload = r => ({ word: r.word, clue: r.clue, subject: r.subject });

export default function WordsTab() {
    const [rows,   setRows]   = useState([]);
    const [loading,setLoading]= useState(true);
    const [modal,  setModal]  = useState(null);
    const [form,   setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const dragId = useRef(null);
    const [overId, setOverId] = useState(null);

    useEffect(() => { load(); }, []);

    async function load() { setLoading(true); setRows(await fetchResource('words')); setLoading(false); }
    function openAdd()     { setForm({ ...EMPTY, sort_order: rows.length }); setModal('add'); }
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

    async function handleDrop(targetId) {
        setOverId(null);
        if (dragId.current === null || dragId.current === targetId) return;
        const from = rows.findIndex(r => r.id === dragId.current);
        const to   = rows.findIndex(r => r.id === targetId);
        if (from < 0 || to < 0) return;
        const next = arrayMove(rows, from, to);
        setRows(next);
        setRows(await persistOrder('words', next, toPayload));
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Word Scramble Vocabulary</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} words · drag rows to reorder</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add word</button>
            </div>
            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead><tr><th aria-label="Reorder" /><th>Word</th><th>Subject</th><th>Clue</th><th>Actions</th></tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr
                                key={r.id}
                                className={overId === r.id ? 'drag-over' : ''}
                                draggable
                                onDragStart={() => { dragId.current = r.id; }}
                                onDragOver={e => { e.preventDefault(); setOverId(r.id); }}
                                onDragLeave={() => setOverId(o => (o === r.id ? null : o))}
                                onDrop={() => handleDrop(r.id)}
                                onDragEnd={() => { dragId.current = null; setOverId(null); }}
                            >
                                <td className="drag-handle" aria-label="Drag to reorder"><i className="fa-solid fa-grip-vertical" /></td>
                                <td style={{ fontWeight: 600, letterSpacing: '.04em' }}>{r.word}</td>
                                <td><span style={{ background: 'rgba(167,139,250,.12)', color: 'var(--purple)', borderRadius: 4, padding: '2px 6px', fontSize: '.75rem' }}>{r.subject}</span></td>
                                <td style={{ fontSize: '.82rem', color: 'var(--slate)' }} dangerouslySetInnerHTML={{ __html: r.clue }} />
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
                            <span className="admin-label">Clue</span>
                            <RichTextEditor
                                value={form.clue}
                                onChange={v => setForm(f => ({ ...f, clue: v }))}
                                placeholder="One-line clue for the word…"
                                minHeight={60}
                            />
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
