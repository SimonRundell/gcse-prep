/**
 * @file BoardsTab.jsx
 * @description Admin interface for exam board data. Uses a JSON editor for the complex nested structure.
 */
import { useState, useEffect } from 'react';
import { fetchResource, updateResource } from '../../api/resources';
import RgbaPicker from '../../components/RgbaPicker';
import axios from 'axios';

export default function BoardsTab() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [active,  setActive]  = useState(null); // board row being edited
    const [json,    setJson]    = useState('');
    const [jsonErr, setJsonErr] = useState('');
    const [saving,  setSaving]  = useState(false);
    const [cfgKey,  setCfgKey]  = useState('subject_labels');
    const [cfgJson, setCfgJson] = useState('');
    const [cfgErr,  setCfgErr]  = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        const d = await fetchResource('boards');
        setData(d);
        setLoading(false);
    }

    function openEdit(row) {
        setActive({ ...row });
        setJson(JSON.stringify(row.data, null, 2));
        setJsonErr('');
    }

    function closeEdit() { setActive(null); }

    async function saveBoard() {
        setJsonErr('');
        let parsed;
        try { parsed = JSON.parse(json); } catch (e) { setJsonErr('Invalid JSON: ' + e.message); return; }
        setSaving(true);
        try {
            await updateResource('boards', active.id, { color: active.color, data: parsed });
            await load();
            closeEdit();
        } catch { /* silent */ }
        setSaving(false);
    }

    function openConfig(key) {
        setCfgKey(key);
        const val = data?.config?.[key];
        setCfgJson(val ? JSON.stringify(val, null, 2) : '{}');
        setCfgErr('');
    }

    async function saveConfig() {
        setCfgErr('');
        let parsed;
        try { parsed = JSON.parse(cfgJson); } catch (e) { setCfgErr('Invalid JSON: ' + e.message); return; }
        setSaving(true);
        try {
            await axios.post('/api/resources.php?type=boards', { config_key: cfgKey, config_value: parsed });
            await load();
            setCfgKey('');
        } catch { /* silent */ }
        setSaving(false);
    }

    if (loading) return <p style={{ color: 'var(--slate)' }}>Loading…</p>;

    const CONFIG_KEYS = ['subject_labels', 'ao_desc', 'topic_bank_map'];

    return (
        <div>
            <p style={{ color: 'var(--slate)', fontSize: '.82rem', marginBottom: 20 }}>
                Board data is stored as JSON. The structure mirrors the original boards.js file: <code style={{ color: 'var(--teal)' }}>{"{ spec: {…}, subjects: {maths: {…}, language: {…}, literature: {…}} }"}</code>
            </p>

            <strong style={{ color: '#fff', display: 'block', marginBottom: 10 }}>Exam Boards</strong>
            <table className="admin-table" style={{ marginBottom: 32 }}>
                <thead><tr><th>Board</th><th>Colour</th><th>Subjects in data</th><th>Actions</th></tr></thead>
                <tbody>
                    {(data?.boards || []).map(b => (
                        <tr key={b.id}>
                            <td style={{ fontWeight: 700 }}>{b.board_code}</td>
                            <td><span style={{ background: b.color, display: 'inline-block', width: 16, height: 16, borderRadius: 3, verticalAlign: 'middle', marginRight: 6 }} />{b.color}</td>
                            <td style={{ fontSize: '.78rem', color: 'var(--slate)' }}>
                                {Object.keys(b.data?.subjects || {}).join(', ') || '—'}
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => openEdit(b)}>Edit JSON</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <strong style={{ color: '#fff', display: 'block', marginBottom: 10 }}>Global Configuration</strong>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {CONFIG_KEYS.map(k => (
                    <button key={k} onClick={() => openConfig(k)} className={cfgKey === k ? 'btn-add' : 'btn-edit'} style={{ minWidth: 140 }}>
                        {k.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>
            {cfgKey && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '.9rem', color: '#fff' }}>{cfgKey.replace(/_/g, ' ')}</h4>
                    <textarea
                        style={{ width: '100%', minHeight: 240, background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, color: '#ccd6e0', fontFamily: '"Courier New", monospace', fontSize: '.8rem', boxSizing: 'border-box', resize: 'vertical' }}
                        value={cfgJson}
                        onChange={e => { setCfgJson(e.target.value); setCfgErr(''); }}
                    />
                    {cfgErr && <p style={{ color: 'var(--coral)', fontSize: '.8rem', margin: '6px 0 0' }}>{cfgErr}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button className="btn-add" onClick={saveConfig} disabled={saving}>{saving ? 'Saving…' : 'Save config'}</button>
                        <button onClick={() => setCfgKey('')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--slate)', padding: '7px 14px', cursor: 'pointer', fontSize: '.82rem' }}>Cancel</button>
                    </div>
                </div>
            )}

            {active && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeEdit()}>
                    <div className="admin-modal" style={{ width: 'min(800px, 95vw)' }}>
                        <h3>Edit board: {active.board_code}</h3>
                        <div className="admin-field">
                            <span className="admin-label">Board colour</span>
                            <RgbaPicker value={active.color} onChange={color => setActive(a => ({ ...a, color }))} />
                        </div>
                        <p style={{ color: 'var(--slate)', fontSize: '.78rem', margin: '0 0 12px' }}>
                            Edit the full JSON data for this board. The top-level keys must be <code>spec</code> and <code>subjects</code>.
                        </p>
                        <textarea
                            style={{ width: '100%', height: 400, background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, color: '#ccd6e0', fontFamily: '"Courier New", monospace', fontSize: '.78rem', boxSizing: 'border-box', resize: 'vertical' }}
                            value={json}
                            onChange={e => { setJson(e.target.value); setJsonErr(''); }}
                        />
                        {jsonErr && <p style={{ color: 'var(--coral)', fontSize: '.8rem', margin: '6px 0' }}>{jsonErr}</p>}
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
                            <button onClick={closeEdit} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--slate)', padding: '7px 16px', cursor: 'pointer' }}>Cancel</button>
                            <button className="btn-add" onClick={saveBoard} disabled={saving}>{saving ? 'Saving…' : 'Save board'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
