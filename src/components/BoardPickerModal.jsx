/**
 * @file BoardPickerModal.jsx
 * @description Overlay modal for selecting an exam board.
 */
import { useAppContext } from '../context/AppContext';

const BOARDS_META = [
  { name: 'AQA',     emoji: '🔴', code: '8300 · 8700 · 8702' },
  { name: 'Edexcel', emoji: '🔵', code: '1MA1 · 1EN0 · 1ET0' },
  { name: 'OCR',     emoji: '🟣', code: 'J560 · J351 · J352'  },
];

export default function BoardPickerModal() {
  const { pickerOpen, pendingBoard, selectBoard, confirmBoard } = useAppContext();

  if (!pickerOpen) return null;

  return (
    <div className="overlay">
      <div className="board-modal">
        <h2>Choose your exam board</h2>
        <p>Questions, mark schemes and feedback will match your board's exact format.</p>
        <div className="board-grid">
          {BOARDS_META.map(b => (
            <div
              key={b.name}
              className={`board-card${pendingBoard === b.name ? ' selected' : ''}`}
              data-board={b.name}
              onClick={() => selectBoard(b.name)}
            >
              <div className="bc-logo">{b.emoji}</div>
              <div className="bc-name">{b.name}</div>
              <div className="bc-code">{b.code}</div>
            </div>
          ))}
        </div>
        <button className="btn-confirm" onClick={confirmBoard}>Let's go →</button>
      </div>
    </div>
  );
}
