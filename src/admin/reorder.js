/**
 * @file reorder.js
 * @description Drag-and-drop row ordering helpers for the admin CRUD tables.
 *              Row order is persisted by writing each row's list index into
 *              its sort_order column (only rows whose position changed are
 *              sent to the API).
 */
import { updateResource } from '../api/resources';

/**
 * Returns a copy of the array with the item at `from` moved to `to`.
 * @param {Array} arr
 * @param {number} from
 * @param {number} to
 * @returns {Array}
 */
export function arrayMove(arr, from, to) {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Persists the current row order as sort_order = index.
 * The PHP update endpoints overwrite every column, so `toPayload` must return
 * the complete field set for the resource type.
 * @param {string} type        - resource type (words | videos | questions | blueprint)
 * @param {Array}  rows        - rows in their new display order
 * @param {Function} toPayload - maps a row to its full update payload (minus sort_order)
 * @returns {Promise<Array>} rows with sort_order updated locally
 */
export async function persistOrder(type, rows, toPayload) {
  const updated = rows.map((r, i) => ({ ...r, sort_order: i }));
  await Promise.all(
    rows.map((r, i) =>
      r.sort_order === i
        ? null
        : updateResource(type, r.id, { ...toPayload(r), sort_order: i })
    )
  );
  return updated;
}
