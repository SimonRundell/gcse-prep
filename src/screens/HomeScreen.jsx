/**
 * @file HomeScreen.jsx
 * @description Dashboard / home screen with hero text and section cards.
 */
import { useAppContext } from '../context/AppContext';
import { BOARD_COLORS, SPEC } from '../data/boards';

export default function HomeScreen() {
  const { currentBoard, openBoardPicker, showScreen, showPractice, initRealPaper, startGame } = useAppContext();
  const color = currentBoard ? BOARD_COLORS[currentBoard] : 'var(--teal)';
  const spec  = currentBoard ? SPEC[currentBoard] : null;

  return (
    <div id="screen-home" className="screen active">
      <div className="home-hero">
        <h1>Ace your <em>GCSEs</em><br />— play to learn.</h1>
        <p>AI-powered exam questions + 5 revision games. Matches your exact exam board format.</p>
        <div
          className="board-banner"
          style={{ borderColor: color, color }}
          onClick={openBoardPicker}
        >
          <div className="board-dot" style={{ background: color }} />
          {currentBoard
            ? <span>Board: {currentBoard} — click to change</span>
            : <span>Select your exam board</span>}
          <span style={{ opacity: .6 }}>▾</span>
        </div>
      </div>

      <div className="section-grid">
        <div className="section-card" onClick={() => showPractice('maths', 'Algebra')}>
          <div className="card-icon"><i className="fa-solid fa-calculator" /></div>
          <h3>Mathematics</h3>
          <p>Number, Algebra, Geometry &amp; Statistics</p>
          <span className="tag tag-study">{spec ? spec.maths : 'Pick a board'}</span>
        </div>
        <div className="section-card" onClick={() => showPractice('language', 'Reading')}>
          <div className="card-icon"><i className="fa-solid fa-book-open" /></div>
          <h3>English Language</h3>
          <p>Reading &amp; Writing — Papers 1 &amp; 2</p>
          <span className="tag tag-study">{spec ? spec.language : 'Pick a board'}</span>
        </div>
        <div className="section-card" onClick={() => showPractice('literature', 'Poetry')}>
          <div className="card-icon"><i className="fa-solid fa-masks-theater" /></div>
          <h3>English Literature</h3>
          <p>Shakespeare, Poetry, Prose &amp; Modern texts</p>
          <span className="tag tag-study">{spec ? spec.literature : 'Pick a board'}</span>
        </div>
        <div className="section-card" style={{ borderColor: 'rgba(167,139,250,.3)' }} onClick={() => showScreen('games')}>
          <div className="card-icon"><i className="fa-solid fa-gamepad" /></div>
          <h3>Games Hub</h3>
          <p>5 revision games — flashcards, speed rounds, beat the examiner &amp; more</p>
          <span className="tag tag-game">Play now</span>
        </div>
        <div className="section-card" onClick={() => showScreen('mock')}>
          <div className="card-icon"><i className="fa-solid fa-clipboard-list" /></div>
          <h3>Mock Exam</h3>
          <p>Full mixed paper across all subjects, your board's format</p>
          <span className="tag tag-study">Take the test</span>
        </div>
        <div className="section-card" style={{ borderColor: 'rgba(230,57,70,.3)' }} onClick={initRealPaper}>
          <div className="card-icon"><i className="fa-solid fa-file-lines" /></div>
          <h3>Real Paper Mode</h3>
          <p>Work through the exact structure of AQA's Nov 2024 Paper 1F — every topic, in order</p>
          <span className="tag" style={{ background: 'rgba(230,57,70,.12)', color: '#e63946' }}>
            27 questions · 80 marks
          </span>
        </div>
        <div className="section-card" onClick={() => showScreen('videos')}>
          <div className="card-icon"><i className="fa-solid fa-video" /></div>
          <h3>Video Lessons</h3>
          <p>The best free GCSE YouTube teachers — maths &amp; English, organised by topic</p>
          <span className="tag tag-study">Watch &amp; learn</span>
        </div>
        <div className="section-card" onClick={() => showScreen('leaderboard')}>
          <div className="card-icon"><i className="fa-solid fa-trophy" /></div>
          <h3>Leaderboard</h3>
          <p>Your personal high scores across all games</p>
          <span className="tag tag-game">See scores</span>
        </div>
      </div>
    </div>
  );
}
