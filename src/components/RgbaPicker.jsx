/**
 * @file RgbaPicker.jsx
 * @description Colour selector that resolves to an rgba(r, g, b, a) string.
 *              Combines the native colour input (for the RGB part) with an
 *              alpha slider. Accepts existing rgba(), rgb() or hex values.
 */

/**
 * Parses a CSS colour string into hex + alpha parts.
 * @param {string} v - rgba(...), rgb(...), #rrggbb or #rgb
 * @returns {{ hex: string, a: number }}
 */
function parseColor(v) {
  if (typeof v === 'string') {
    const m = v.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/i);
    if (m) {
      const hex = '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
      return { hex, a: m[4] !== undefined ? Math.min(1, +m[4]) : 1 };
    }
    if (/^#[0-9a-f]{6}$/i.test(v)) return { hex: v, a: 1 };
    if (/^#[0-9a-f]{3}$/i.test(v)) {
      return { hex: '#' + v.slice(1).split('').map(c => c + c).join(''), a: 1 };
    }
  }
  return { hex: '#00c9a7', a: 1 };
}

/**
 * @param {string} hex - #rrggbb
 * @param {number} a   - alpha 0..1
 * @returns {string} rgba(r, g, b, a)
 */
function toRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * @param {{ value?: string, onChange: Function }} props
 *        value    - current colour (rgba/rgb/hex); always reported back as rgba
 *        onChange - called with the rgba(r, g, b, a) string
 */
export default function RgbaPicker({ value = '', onChange }) {
  const { hex, a } = parseColor(value);

  return (
    <div className="rgba-picker">
      <input
        type="color"
        value={hex}
        onChange={e => onChange(toRgba(e.target.value, a))}
        title="Pick colour"
      />
      <input
        type="range"
        min="0" max="1" step="0.01"
        value={a}
        onChange={e => onChange(toRgba(hex, +e.target.value))}
        title={`Opacity ${Math.round(a * 100)}%`}
      />
      <span className="rgba-swatch" style={{ background: toRgba(hex, a) }} />
      <span className="rgba-value">{toRgba(hex, a)}</span>
    </div>
  );
}
