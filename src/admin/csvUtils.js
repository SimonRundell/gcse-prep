/**
 * @file csvUtils.js
 * @description CSV parse / export helpers and per-resource-type schemas for
 *              the admin bulk-import feature.
 *
 * Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
 * Creative Commons NC-BY-SA 4.0
 */

/**
 * Strip the UTF-8 BOM that Excel inserts when saving as "CSV UTF-8".
 * @param {string} text
 * @returns {string}
 */
function stripBom(text) {
    return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

/**
 * Split CSV text into logical line strings, respecting fields that contain
 * quoted newlines (e.g. multi-line text cells from Excel).
 * @param {string} text
 * @returns {string[]}
 */
function splitLines(text) {
    const lines = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            if (inQuote && text[i + 1] === '"') { current += '"'; i++; }
            else { inQuote = !inQuote; }
        } else if (ch === '\n' && !inQuote) {
            lines.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    if (current) lines.push(current);
    return lines;
}

/**
 * Parse a single CSV line into an array of field values, handling quoted
 * fields and doubled-quote escaping.
 * @param {string} line
 * @returns {string[]}
 */
function parseRow(line) {
    const fields = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuote && line[i + 1] === '"') { current += '"'; i++; }
            else { inQuote = !inQuote; }
        } else if (ch === ',' && !inQuote) {
            fields.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    fields.push(current);
    return fields;
}

/**
 * Parse a CSV string (as read from a file) into a list of plain objects keyed
 * by the header row. Handles the UTF-8 BOM, Windows CRLF line endings, quoted
 * fields, embedded commas, and doubled-quote escaping.
 *
 * @param {string} text  Raw file contents.
 * @returns {{ headers: string[], rows: object[] }}
 */
export function parseCSV(text) {
    const clean = stripBom(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = splitLines(clean).filter(l => l.trim() !== '');
    if (lines.length < 2) return { headers: [], rows: [] };

    const headers = parseRow(lines[0]).map(h => h.trim().toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseRow(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = (values[idx] ?? '').trim(); });
        rows.push(obj);
    }
    return { headers, rows };
}

/**
 * Escape a single value for CSV output (wraps in quotes if needed).
 * @param {*} v
 * @returns {string}
 */
function csvEscape(v) {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

/**
 * Convert an array of objects to a CSV string with a header row.
 * @param {string[]} columns  Ordered list of column names.
 * @param {object[]} rows
 * @returns {string}
 */
function toCsvString(columns, rows) {
    const header = columns.join(',');
    const body   = rows.map(r => columns.map(c => csvEscape(r[c] ?? '')).join(','));
    return [header, ...body].join('\r\n');
}

/**
 * Build a CSV file (with UTF-8 BOM for Excel compatibility) and trigger a
 * browser download.
 *
 * @param {string}   filename  e.g. 'questions.csv'
 * @param {string[]} columns   Column names in desired order.
 * @param {object[]} rows      Data rows (objects keyed by column name).
 */
export function downloadCsv(filename, columns, rows) {
    const csv  = '﻿' + toCsvString(columns, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Per-resource-type CSV schema definitions.
 *
 * @typedef {object} CsvSchema
 * @property {string}   label         Human-readable name shown in the modal header.
 * @property {string[]} columns       Ordered list of CSV column names.
 * @property {string[]} required      Columns that must be present in the header row.
 * @property {string[]|null} upsertKey  Column(s) used for upsert matching; null = always insert.
 * @property {function(object): object} prepareRow     CSV row → API payload.
 * @property {function(object): object} prepareExport  API row → CSV export row.
 */

/** @type {Record<string, CsvSchema>} */
export const CSV_SCHEMAS = {

    questions: {
        label:     'Questions',
        columns:   ['slot', 'topic', 'question', 'answer', 'marks'],
        required:  ['slot', 'topic', 'question', 'answer'],
        upsertKey: null,
        prepareRow: r => ({
            slot:       r.slot,
            topic:      r.topic,
            question:   r.question,
            answer:     r.answer,
            marks:      parseInt(r.marks, 10) || 1,
            sort_order: 0,
        }),
        prepareExport: r => ({
            slot:     r.slot,
            topic:    r.topic,
            question: r.question,
            answer:   r.answer,
            marks:    r.marks,
        }),
    },

    words: {
        label:     'Words',
        columns:   ['word', 'clue', 'subject'],
        required:  ['word', 'subject'],
        upsertKey: ['word', 'subject'],
        prepareRow: r => ({
            word:       r.word,
            clue:       r.clue ?? '',
            subject:    r.subject,
            sort_order: 0,
        }),
        prepareExport: r => ({
            word:    r.word,
            clue:    r.clue ?? '',
            subject: r.subject,
        }),
    },

    videos: {
        label:     'Videos',
        columns:   ['subject', 'name', 'icon', 'bg', 'url', 'description', 'topics'],
        required:  ['subject', 'name', 'url'],
        upsertKey: ['url'],
        /** Topics arrive as a pipe-separated string; convert to array for the API. */
        prepareRow: r => ({
            subject:     r.subject,
            name:        r.name,
            icon:        r.icon        ?? '',
            bg:          r.bg          ?? '',
            url:         r.url,
            description: r.description ?? '',
            topics:      r.topics
                ? r.topics.split('|').map(t => t.trim()).filter(Boolean)
                : [],
            sort_order: 0,
        }),
        /** Convert topics array back to pipe-separated for CSV. */
        prepareExport: r => ({
            subject:     r.subject,
            name:        r.name,
            icon:        r.icon        ?? '',
            bg:          r.bg          ?? '',
            url:         r.url,
            description: r.description ?? '',
            topics:      Array.isArray(r.topics) ? r.topics.join('|') : (r.topics ?? ''),
        }),
    },

    blueprint: {
        label:     'Blueprint',
        columns:   ['q_ref', 'topic', 'style', 'marks'],
        required:  ['q_ref', 'topic', 'style'],
        upsertKey: ['q_ref'],
        prepareRow: r => ({
            q_ref:      r.q_ref,
            topic:      r.topic,
            style:      r.style,
            marks:      parseInt(r.marks, 10) || 1,
            sort_order: 0,
        }),
        prepareExport: r => ({
            q_ref: r.q_ref,
            topic: r.topic,
            style: r.style,
            marks: r.marks,
        }),
    },
};
