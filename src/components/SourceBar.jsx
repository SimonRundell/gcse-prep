/**
 * @file SourceBar.jsx
 * @description Meta info bar displayed above question cards, showing spec, paper, AOs, etc.
 */

/**
 * @param {{ cols: Array<{label:string, value:string|React.ReactNode}>, badge?: {label:string, color:string} }} props
 */
export default function SourceBar({ cols = [], badge }) {
  return (
    <div className="source-bar">
      {cols.map((col, i) => (
        <div key={i} style={{ display: 'contents' }}>
          {i > 0 && <div className="src-div" />}
          <div className="src-col">
            <span className="src-lbl">{col.label}</span>
            <span className="src-val" style={col.small ? { fontSize: '.76rem' } : {}}>
              {col.value}
            </span>
          </div>
        </div>
      ))}
      {badge && (
        <span
          className="board-badge"
          style={{ color: badge.color, borderColor: badge.color, background: 'rgba(0,0,0,.2)' }}
        >
          {badge.label}
        </span>
      )}
    </div>
  );
}
