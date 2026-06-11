/**
 * @file QuestionsTab.jsx
 * @description CRUD interface for the question bank. Rows are reordered by
 *              drag-and-drop (persisted to sort_order); reordering is disabled
 *              while the filter is active, since the visible list is a subset.
 */
import { useState, useEffect, useRef } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';
import { arrayMove, persistOrder } from '../reorder';

const EMPTY = { slot: '', topic: '', question: '', answer: '', marks: 1, sort_order: 0 };

/** Full update payload for a row (the PHP endpoint overwrites every column). */
const toPayload = r => ({ slot: r.slot, topic: r.topic, question: r.question, answer: r.answer, marks: r.marks });

export default function QuestionsTab() {
    const [rows,    setRows]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal,   setModal]   = useState(null); // null | 'add' | row object
    const [form,    setForm]    = useState(EMPTY);
    const [saving,  setSaving]  = useState(false);
    const [filter,  setFilter]  = useState('');
    const dragId = useRef(null);
    const [overId,  setOverId]  = useState(null);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        setRows(await fetchResource('questions'));
        setLoading(false);
    }

    function openAdd()      { setForm({ ...EMPTY, sort_order: rows.length }); setModal('add'); }
    function openEdit(row)  { setForm({ slot: row.slot, topic: row.topic, question: row.question, answer: row.answer, marks: row.marks, sort_order: row.sort_order }); setModal(row); }
    function closeModal()   { setModal(null); }

    async function save() {
        setSaving(true);
        try {
            if (modal === 'add') {
                await createResource('questions', form);
            } else {
                await updateResource('questions', modal.id, form);
            }
            await load();
            closeModal();
        } catch { /* error silently */ }
        setSaving(false);
    }

    async function remove(id) {
        if (!confirm('Delete this question?')) return;
        await deleteResource('questions', id);
        load();
    }

    async function handleDrop(targetId) {
        setOverId(null);
        if (filter || dragId.current === null || dragId.current === targetId) return;
        const from = rows.findIndex(r => r.id === dragId.current);
        const to   = rows.findIndex(r => r.id === targetId);
        if (from < 0 || to < 0) return;
        const next = arrayMove(rows, from, to);
        setRows(next);
        setRows(await persistOrder('questions', next, toPayload));
    }

    const visible = filter
        ? rows.filter(r => r.topic.toLowerCase().includes(filter.toLowerCase()) || r.question.toLowerCase().includes(filter.toLowerCase()))
        : rows;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Question Bank</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>
                        {rows.length} questions · {filter ? 'clear the filter to drag-reorder' : 'drag rows to reorder'}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        placeholder="Filter by topic / question…"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px', color: '#ccd6e0', fontSize: '.82rem', width: 220 }}
                    />
                    <button className="btn-add" onClick={openAdd}>+ Add question</button>
                </div>
            </div>
            {loading
                ? <p style={{ color: 'var(--slate)' }}>Loading…</p>
                : (
                    <table className="admin-table">
                        <thead>
                            <tr><th aria-label="Reorder" /><th>Slot</th><th>Topic</th><th style={{ width: 300 }}>Question</th><th>Marks</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {visible.map(r => (
                                <tr
                                    key={r.id}
                                    className={overId === r.id ? 'drag-over' : ''}
                                    draggable={!filter}
                                    onDragStart={() => { dragId.current = r.id; }}
                                    onDragOver={e => { if (!filter) { e.preventDefault(); setOverId(r.id); } }}
                                    onDragLeave={() => setOverId(o => (o === r.id ? null : o))}
                                    onDrop={() => handleDrop(r.id)}
                                    onDragEnd={() => { dragId.current = null; setOverId(null); }}
                                >
                                    <td className="drag-handle">{!filter && <i className="fa-solid fa-grip-vertical" />}</td>
                                    <td><span style={{ background: 'rgba(0,201,167,.12)', color: 'var(--teal)', borderRadius: 4, padding: '2px 6px', fontSize: '.78rem' }}>{r.slot}</span></td>
                                    <td style={{ color: 'var(--slate)', fontSize: '.82rem' }}>{r.topic}</td>
                                    <td style={{ fontSize: '.82rem', maxWidth: 300 }}>{r.question.slice(0, 90)}{r.question.length > 90 ? '…' : ''}</td>
                                    <td style={{ color: 'var(--gold)' }}>{r.marks}</td>
                                    <td><div className="admin-actions">
                                        <button className="btn-edit"   onClick={() => openEdit(r)}>Edit</button>
                                        <button className="btn-delete" onClick={() => remove(r.id)}>Delete</button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }

            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="admin-modal">
                        <h3>{modal === 'add' ? 'Add question' : 'Edit question'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div className="admin-field">
                                <label>Slot (e.g. Q1)</label>
                                <input value={form.slot} onChange={e => setForm(f => ({ ...f, slot: e.target.value }))} />
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
                            <label>Question</label>
                            <textarea rows={3} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
                        </div>
                        <div className="admin-field">
                            <label>Answer / mark scheme</label>
                            <textarea rows={3} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                            <button onClick={closeModal} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--slate)', padding: '7px 16px', cursor: 'pointer' }}>Cancel</button>
                            <button className="btn-add" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
