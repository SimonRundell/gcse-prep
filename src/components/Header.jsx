/**
 * @file Header.jsx
 * @description Sticky header with logo and board selector button.
 */
import { useAppContext } from '../context/AppContext';
import { BOARD_COLORS } from '../data/boards';

export default function Header() {
  const { currentBoard, openBoardPicker } = useAppContext();
  const color = currentBoard ? BOARD_COLORS[currentBoard] : 'var(--teal)';

  return (
    <header>
      <div className="logo">GCSE<span>Prep</span></div>
      <button className="board-selector-btn" onClick={openBoardPicker}>
        <div className="board-dot" style={{ background: color }} />
        <span>Board: </span>
        <span className="board-name-display" style={{ color }}>
          {currentBoard || '—'}
        </span>
        <span style={{ color: 'var(--slate)', fontSize: '.75rem' }}>▾</span>
      </button>
    </header>
  );
}
