/**
 * @file Header.jsx
 * @description Sticky header with logo, board selector button, and subtle admin link.
 */
import { useAppContext } from '../context/AppContext';

export default function Header() {
    const { currentBoard, openBoardPicker, boardColors } = useAppContext();
    const color = currentBoard ? (boardColors[currentBoard] || 'var(--teal)') : 'var(--teal)';

    return (
        <header>
            <div className="logo">GCSE<span>Prep</span></div>
            <button className="board-selector-btn" onClick={openBoardPicker}>
                <div className="board-dot" style={{ background: color }} />
                <span>Board: </span>
                <span className="board-name-display" style={{ color }}>{currentBoard || '—'}</span>
                <span style={{ color: 'var(--slate)', fontSize: '.75rem' }}>▾</span>
            </button>
            <a href="/admin" className="admin-link" title="Admin"><i className="fa-solid fa-gear" /></a>
        </header>
    );
}
