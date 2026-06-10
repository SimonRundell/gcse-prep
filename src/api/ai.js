/**
 * @file ai.js
 * @description axios wrapper for the PHP Anthropic proxy endpoint.
 */
import axios from 'axios';

/**
 * Calls the server-side AI proxy and returns the text of Claude's response.
 * @param {string} system - System prompt
 * @param {string} userMsg - User message
 * @param {number} [maxTokens=800] - Maximum tokens in the response
 * @returns {Promise<string>}
 */
export async function callAI(system, userMsg, maxTokens = 800) {
  const { data } = await axios.post('/api/ai.php', { system, userMsg, maxTokens });
  return data.text;
}

/** Parses JSON out of a response that may be wrapped in markdown fences. */
export function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}
