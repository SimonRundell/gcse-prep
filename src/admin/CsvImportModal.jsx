/**
 * @file CsvImportModal.jsx
 * @description Reusable three-stage CSV import modal for admin bulk uploads.
 *
 *   Stage 1 — upload:   shows expected column names, drag-drop / browse zone.
 *   Stage 2 — preview:  shows first 5 parsed rows for confirmation.
 *   Stage 3 — done:     shows a spinner while importing, then inserted/updated/error counts.
 *
 * @param {object}   props
 * @param {string}   props.type      Resource type key (questions | words | videos | blueprint).
 * @param {function} props.onImport  Async function that receives the prepared row array and
 *                                   returns { inserted, updated, errors }.
 * @param {function} props.onClose   Called when the modal should close.
 *
 * Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
 * Creative Commons NC-BY-SA 4.0
 */
import { useState, useRef } from 'react';
import { parseCSV, CSV_SCHEMAS } from './csvUtils';

export default function CsvImportModal({ type, onImport, onClose }) {
    const schema = CSV_SCHEMAS[type];

    const [stage,    setStage]    = useState('upload');  // 'upload' | 'preview' | 'done'
    const [parsed,   setParsed]   = useState(null);
    const [result,   setResult]   = useState(null);
    const [error,    setError]    = useState('');
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    /** Parse raw file text and move to preview stage, or surface a header error. */
    function processText(text) {
        setError('');
        const { headers, rows } = parseCSV(text);
        const missing = schema.required.filter(c => !headers.includes(c));
        if (missing.length) {
            setError('Missing required columns: ' + missing.join(', '));
            return;
        }
        if (!rows.length) {
            setError('The file contains no data rows.');
            return;
        }
        setParsed({ headers, rows });
        setStage('preview');
    }

    function handleFile(file) {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setError('Please select a .csv file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => processText(e.target.result);
        reader.readAsText(file, 'UTF-8');
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }

    async function doImport() {
        setStage('done');
        const payload = parsed.rows
            .map(r => { try { return schema.prepareRow(r); } catch { return null; } })
            .filter(Boolean);
        try {
            const res = await onImport(payload);
            setResult(res);
        } catch (err) {
            setResult({
                inserted: 0,
                updated:  0,
                errors:   ['Import failed: ' + (err?.response?.data?.error ?? err?.message ?? 'Unknown error')],
            });
        }
    }

    /** Only the columns that are actually present in the uploaded file. */
    const previewCols = schema.columns.filter(c => parsed?.headers.includes(c));
    const previewRows = parsed?.rows.slice(0, 5) ?? [];

    return (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="admin-modal csv-import-modal">

                <div className="csv-modal-header">
                    <h3>Import {schema.label} from CSV</h3>
                    <button className="csv-close-btn" onClick={onClose} aria-label="Close modal">
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                {/* ---- Stage 1: upload ---- */}
                {stage === 'upload' && (
                    <>
                        <div className="csv-columns-info">
                            <p>Your CSV must include a header row with these column names. Required columns are highlighted.</p>
                            <div className="csv-columns-list">
                                {schema.columns.map(c => (
                                    <span
                                        key={c}
                                        className={`csv-col-chip ${schema.required.includes(c) ? 'required' : 'optional'}`}
                                    >
                                        {c}{!schema.required.includes(c) && <em> (optional)</em>}
                                    </span>
                                ))}
                            </div>
                            {schema.upsertKey ? (
                                <p className="csv-note">
                                    <i className="fa-solid fa-circle-info" /> Rows where <strong>{schema.upsertKey.join(' + ')}</strong> matches an existing record will be updated; all others will be inserted.
                                </p>
                            ) : (
                                <p className="csv-note">
                                    <i className="fa-solid fa-circle-info" /> All rows will be inserted as new records.
                                </p>
                            )}
                            {type === 'videos' && (
                                <p className="csv-note">
                                    <i className="fa-solid fa-circle-info" /> Separate multiple topics with a pipe character: <code>Algebra|Fractions|Geometry</code>
                                </p>
                            )}
                        </div>

                        <div
                            className={`csv-dropzone${dragging ? ' dragging' : ''}`}
                            onClick={() => fileRef.current.click()}
                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && fileRef.current.click()}
                            aria-label="Upload CSV file"
                        >
                            <i className="fa-solid fa-file-csv csv-drop-icon" />
                            <p>Drag a CSV file here, or <span className="csv-browse-link">click to browse</span></p>
                            <p className="csv-drop-hint">In Excel: File &rarr; Save As &rarr; CSV UTF-8 (Comma delimited)</p>
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".csv,text/csv"
                            hidden
                            onChange={e => handleFile(e.target.files[0])}
                        />
                        {error && (
                            <p className="csv-error">
                                <i className="fa-solid fa-triangle-exclamation" /> {error}
                            </p>
                        )}
                    </>
                )}

                {/* ---- Stage 2: preview ---- */}
                {stage === 'preview' && (
                    <>
                        <p className="csv-preview-count">
                            <strong style={{ color: '#fff' }}>{parsed.rows.length}</strong> rows found
                            {parsed.rows.length > 5 && ` — showing first 5`}
                        </p>
                        <div className="csv-preview-table-wrap">
                            <table className="csv-preview-table">
                                <thead>
                                    <tr>{previewCols.map(c => <th key={c}>{c}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {previewRows.map((row, i) => (
                                        <tr key={i}>
                                            {previewCols.map(c => {
                                                const val = String(row[c] ?? '');
                                                return (
                                                    <td key={c} title={val}>
                                                        {val.slice(0, 60)}{val.length > 60 ? '…' : ''}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="csv-modal-actions">
                            <button
                                className="csv-back-btn"
                                onClick={() => { setStage('upload'); setParsed(null); setError(''); }}
                            >
                                <i className="fa-solid fa-arrow-left" /> Back
                            </button>
                            <button className="btn-add" onClick={doImport}>
                                Import {parsed.rows.length} {parsed.rows.length === 1 ? 'row' : 'rows'}
                            </button>
                        </div>
                    </>
                )}

                {/* ---- Stage 3: done (spinner then result) ---- */}
                {stage === 'done' && !result && (
                    <div className="csv-importing">
                        <i className="fa-solid fa-spinner fa-spin" />
                        <p>Importing, please wait&hellip;</p>
                    </div>
                )}

                {stage === 'done' && result && (
                    <div className="csv-result">
                        <div className="csv-result-stats">
                            <div className="csv-stat">
                                <span className="csv-stat-num inserted">{result.inserted}</span>
                                <span className="csv-stat-label">inserted</span>
                            </div>
                            <div className="csv-stat">
                                <span className="csv-stat-num updated">{result.updated}</span>
                                <span className="csv-stat-label">updated</span>
                            </div>
                            <div className="csv-stat">
                                <span className="csv-stat-num errors">{result.errors?.length ?? 0}</span>
                                <span className="csv-stat-label">errors</span>
                            </div>
                        </div>
                        {result.errors?.length > 0 && (
                            <div className="csv-errors-list">
                                {result.errors.map((e, i) => (
                                    <p key={i} className="csv-row-error">
                                        <i className="fa-solid fa-triangle-exclamation" /> {e}
                                    </p>
                                ))}
                            </div>
                        )}
                        <div className="csv-modal-actions">
                            <span />
                            <button className="btn-add" onClick={onClose}>Done</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
