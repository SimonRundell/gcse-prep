/**
 * @file resources.js
 * @description Axios wrappers for the resources REST endpoint.
 */
import axios from 'axios';

const BASE = '/api/resources.php';

/**
 * Fetch all records for a given resource type (open, no auth).
 * @param {'questions'|'words'|'videos'|'blueprint'|'boards'} type
 */
export function fetchResource(type) {
    return axios.get(BASE, { params: { type } }).then(r => r.data);
}

/**
 * Create a new record.
 * @param {string} type
 * @param {object} data
 */
export function createResource(type, data) {
    return axios.post(BASE, data, { params: { type } }).then(r => r.data);
}

/**
 * Update an existing record.
 * @param {string} type
 * @param {number} id
 * @param {object} data
 */
export function updateResource(type, id, data) {
    return axios.put(BASE, data, { params: { type, id } }).then(r => r.data);
}

/**
 * Delete a record.
 * @param {string} type
 * @param {number} id
 */
export function deleteResource(type, id) {
    return axios.delete(BASE, { params: { type, id } }).then(r => r.data);
}

// ---- Admin auth helpers -----------------------------------------

/**
 * Check admin session status and whether any admin account exists.
 * @returns {Promise<{loggedIn: boolean, hasAdmin: boolean}>}
 */
export function checkAdminAuth() {
    return axios.get('/api/admin_auth.php').then(r => r.data);
}

/**
 * @param {string} email
 * @param {string} password
 */
export function adminLogin(email, password) {
    return axios.post('/api/admin_auth.php', { action: 'login', email, password }).then(r => r.data);
}

export function adminLogout() {
    return axios.post('/api/admin_auth.php', { action: 'logout' }).then(r => r.data);
}

/**
 * First-run setup: create the initial admin account.
 * @param {string} email
 * @param {string} password
 */
export function adminSetup(email, password) {
    return axios.post('/api/admin_auth.php', { action: 'setup', email, password }).then(r => r.data);
}

// ---- Admin user management (requires active session) ---------------

/** @returns {Promise<Array<{id: number, email: string, created_at: string}>>} */
export function listAdminUsers() {
    return axios.post('/api/admin_auth.php', { action: 'list' }).then(r => r.data);
}

/** @param {string} email @param {string} password */
export function createAdminUser(email, password) {
    return axios.post('/api/admin_auth.php', { action: 'create', email, password }).then(r => r.data);
}

/** @param {number} id @param {string} email @param {string} password — empty string = keep current */
export function updateAdminUser(id, email, password) {
    return axios.post('/api/admin_auth.php', { action: 'update', id, email, password }).then(r => r.data);
}

/** @param {number} id */
export function deleteAdminUser(id) {
    return axios.post('/api/admin_auth.php', { action: 'delete', id }).then(r => r.data);
}
