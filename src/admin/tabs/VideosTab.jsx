/**
 * @file VideosTab.jsx
 * @description CRUD interface for video channel listings. Rows are reordered
 *              by drag-and-drop (persisted to sort_order); the edit modal uses
 *              an icon dropdown, an rgba colour picker and a rich text editor.
 */
import { useState, useEffect, useRef } from 'react';
import { fetchResource, createResource, updateResource, deleteResource } from '../../api/resources';
import RichTextEditor from '../../components/RichTextEditor';
import IconPicker from '../../components/IconPicker';
import RgbaPicker from '../../components/RgbaPicker';
import { arrayMove, persistOrder } from '../reorder';

const EMPTY = { subject: 'maths', name: '', icon: '', bg: '', url: '', description: '', topics: [], sort_order: 0 };

/** Full update payload for a row (the PHP endpoint overwrites every column). */
const toPayload = r => ({ subject: r.subject, name: r.name, icon: r.icon || '', bg: r.bg || '', url: r.url, description: r.description || '', topics: r.topics || [] });

/** Renders a Font Awesome class as an icon, or legacy emoji text as-is. */
function ChannelIcon({ value }) {
    if (!value) return null;
    return value.startsWith('fa-') ? <i className={`fa-solid ${value}`} /> : <>{value}</>;
}

export default function VideosTab() {
    const [rows,   setRows]   = useState([]);
    const [loading,setLoading]= useState(true);
    const [modal,  setModal]  = useState(null);
    const [form,   setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [topicsText, setTopicsText] = useState('');
    const dragId = useRef(null);
    const [overId, setOverId] = useState(null);

    useEffect(() => { load(); }, []);

    async function load() { setLoading(true); setRows(await fetchResource('videos')); setLoading(false); }

    function openAdd() { setForm({ ...EMPTY, sort_order: rows.length }); setTopicsText(''); setModal('add'); }
    function openEdit(row) {
        const f = { subject: row.subject, name: row.name, icon: row.icon || row.emoji || '', bg: row.bg || '', url: row.url, description: row.description || '', topics: row.topics || [], sort_order: row.sort_order };
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

    async function handleDrop(targetId) {
        setOverId(null);
        if (dragId.current === null || dragId.current === targetId) return;
        const from = rows.findIndex(r => r.id === dragId.current);
        const to   = rows.findIndex(r => r.id === targetId);
        if (from < 0 || to < 0) return;
        const next = arrayMove(rows, from, to);
        setRows(next);
        setRows(await persistOrder('videos', next, toPayload));
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <strong style={{ color: '#fff' }}>Video Channels</strong>
                    <span style={{ color: 'var(--slate)', marginLeft: 8, fontSize: '.82rem' }}>{rows.length} channels · drag rows to reorder</span>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Add channel</button>
            </div>
            {loading ? <p style={{ color: 'var(--slate)' }}>Loading…</p> : (
                <table className="admin-table">
                    <thead><tr><th aria-label="Reorder" /><th>Subject</th><th>Name</th><th>URL</th><th>Topics</th><th>Actions</th></tr></thead>
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
                                <td><span style={{ fontSize: '.75rem', background: 'rgba(0,201,167,.1)', color: 'var(--teal)', borderRadius: 4, padding: '2px 6px' }}>{r.subject}</span></td>
                                <td><ChannelIcon value={r.icon || r.emoji} /> {r.name}</td>
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
                                <span className="admin-label">Icon</span>
                                <IconPicker value={form.icon} onChange={icon => setForm(f => ({ ...f, icon }))} />
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
                            <span className="admin-label">Background colour</span>
                            <RgbaPicker value={form.bg} onChange={bg => setForm(f => ({ ...f, bg }))} />
                        </div>
                        <div className="admin-field">
                            <span className="admin-label">Description</span>
                            <RichTextEditor
                                value={form.description}
                                onChange={v => setForm(f => ({ ...f, description: v }))}
                                placeholder="Channel description…"
                                minHeight={70}
                            />
                        </div>
                        <div className="admin-field">
                            <label>Topics (one per line)</label>
                            <textarea rows={5} value={topicsText} onChange={e => setTopicsText(e.target.value)} placeholder="Fractions&#10;Percentages&#10;Ratio" />
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
