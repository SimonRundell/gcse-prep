/**
 * @file Header.jsx
 * @description Top navigation bar with dropdown menus (desktop) and slide-in drawer (mobile).
 */
import { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const NAV_GROUPS = [
  {
    id: 'maths', label: 'Maths', accent: 'var(--gold)',
    items: [
      { label: 'Number',     icon: 'fa-hashtag',        subject: 'maths', topic: 'Number' },
      { label: 'Algebra',    icon: 'fa-calculator',     subject: 'maths', topic: 'Algebra' },
      { label: 'Geometry',   icon: 'fa-ruler-combined', subject: 'maths', topic: 'Geometry' },
      { label: 'Statistics', icon: 'fa-chart-bar',      subject: 'maths', topic: 'Statistics' },
    ],
  },
  {
    id: 'language', label: 'English Language', accent: 'var(--teal)',
    items: [
      { label: 'Reading', icon: 'fa-book-open', subject: 'language', topic: 'Reading' },
      { label: 'Writing', icon: 'fa-pen-nib',   subject: 'language', topic: 'Writing' },
    ],
  },
  {
    id: 'literature', label: 'Literature', accent: 'var(--coral)',
    items: [
      { label: 'Shakespeare', icon: 'fa-masks-theater', subject: 'literature', topic: 'Shakespeare' },
      { label: 'Poetry',      icon: 'fa-feather',       subject: 'literature', topic: 'Poetry' },
    ],
  },
  {
    id: 'revision', label: 'Revision', accent: 'var(--slate)',
    items: [
      { label: 'Mock Exam',       icon: 'fa-clipboard-list', screen: 'mock' },
      { label: 'Real Paper Mode', icon: 'fa-file-lines',     screen: 'real-paper', badge: 'AQA',  badgeClass: 'pill-m' },
      { label: 'Question Bank',   icon: 'fa-layer-group',    screen: 'qbank',      badge: '100+', badgeClass: 'pill-m' },
      { label: 'Video Lessons',   icon: 'fa-video',          screen: 'videos',     badge: 'NEW',  badgeClass: 'pill-el' },
    ],
  },
  {
    id: 'games', label: 'Games', accent: 'var(--purple)',
    items: [
      { label: 'Games Hub',     icon: 'fa-gamepad',      screen: 'games',  badge: 'NEW', badgeClass: 'pill-game' },
      { label: 'Flashcards',    icon: 'fa-address-card', screen: 'flashcard' },
      { label: 'Speed Round',   icon: 'fa-bolt',         screen: 'speed' },
      { label: 'Beat Examiner', icon: 'fa-bullseye',     screen: 'gte' },
      { label: 'Word Scramble', icon: 'fa-font',         screen: 'scramble' },
      { label: 'Match-Up',      icon: 'fa-puzzle-piece', screen: 'match' },
      { label: 'Leaderboard',   icon: 'fa-trophy',       screen: 'leaderboard' },
    ],
  },
];

const GAME_SCREENS = new Set(['flashcard', 'speed', 'gte', 'scramble', 'match']);

export default function Header() {
  const {
    currentScreen, screenParams,
    currentBoard, openBoardPicker, boardColors,
    showScreen, showPractice, startGame, initRealPaper, initQBank,
  } = useAppContext();

  const [openGroup, setOpenGroup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(null);
  const boardColor = currentBoard ? (boardColors[currentBoard] || 'var(--teal)') : 'var(--teal)';

  const closeMobileNav = () => setMenuOpen(false);

  const open  = (id) => { clearTimeout(closeTimer.current); setOpenGroup(id); };
  const close = ()   => { closeTimer.current = setTimeout(() => setOpenGroup(null), 150); };

  const handleAction = (item) => {
    setOpenGroup(null);
    if (item.subject)                       showPractice(item.subject, item.topic);
    else if (item.screen === 'real-paper')  initRealPaper();
    else if (item.screen === 'qbank')       initQBank();
    else if (GAME_SCREENS.has(item.screen)) startGame(item.screen);
    else                                    showScreen(item.screen);
  };

  const isItemActive = (item) => item.subject
    ? currentScreen === 'practice' && screenParams?.subject === item.subject && screenParams?.topic === item.topic
    : currentScreen === item.screen;

  const isGroupActive = (group) => group.items.some(isItemActive);

  return (
    <>
      <header>
        {/* Hamburger — visible on mobile only */}
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <i className="fa-solid fa-bars" />
        </button>

        <button className="logo" onClick={() => showScreen('home')}>
          <img src="/assets/favicon.png" alt="" className="logo-img" />
          GCSE<span>Prep</span>
        </button>

        <nav className="main-nav">
          {NAV_GROUPS.map((group) => {
            const active = isGroupActive(group);
            return (
              <div key={group.id} className={`nav-group${active ? ' active' : ''}`}
                onMouseEnter={() => open(group.id)} onMouseLeave={close}>
                <button className="nav-group-btn"
                  style={active ? { color: group.accent, borderBottomColor: group.accent } : undefined}>
                  {group.label} <span className="nav-chevron">▾</span>
                </button>
                {openGroup === group.id && (
                  <div className="nav-dropdown">
                    {group.items.map((item) => (
                      <button key={item.label}
                        className={`nav-dropdown-item${isItemActive(item) ? ' active' : ''}`}
                        onClick={() => handleAction(item)}>
                        <i className={`fa-solid fa-fw ${item.icon}`} />
                        <span>{item.label}</span>
                        {item.badge && <span className={`pill ${item.badgeClass}`}>{item.badge}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="header-right">
          <button className="board-selector-btn" onClick={openBoardPicker}>
            <div className="board-dot" style={{ background: boardColor }} />
            <span>Board: </span>
            <span className="board-name-display" style={{ color: boardColor }}>{currentBoard || '—'}</span>
            <span style={{ color: 'var(--slate)', fontSize: '.75rem' }}>▾</span>
          </button>
          <button className="admin-link" onClick={() => showScreen('admin')}>
            ADMIN
          </button>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={closeMobileNav}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-head">
              <button className="logo" onClick={() => { showScreen('home'); closeMobileNav(); }}>
                GCSE<span>Prep</span>
              </button>
              <button className="mobile-nav-close" onClick={closeMobileNav} aria-label="Close menu">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="mobile-nav-body">
              {NAV_GROUPS.map((group) => (
                <div key={group.id} className="mobile-nav-group">
                  <div className="mobile-nav-group-lbl" style={{ color: group.accent }}>
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      className={`mobile-nav-item${isItemActive(item) ? ' active' : ''}`}
                      style={isItemActive(item) ? { color: group.accent } : undefined}
                      onClick={() => { handleAction(item); closeMobileNav(); }}
                    >
                      <i className={`fa-solid fa-fw ${item.icon}`} />
                      <span>{item.label}</span>
                      {item.badge && <span className={`pill ${item.badgeClass}`}>{item.badge}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="mobile-nav-footer">
              <button className="board-selector-btn" onClick={() => { openBoardPicker(); closeMobileNav(); }}>
                <div className="board-dot" style={{ background: boardColor }} />
                <span>Exam board: </span>
                <span className="board-name-display" style={{ color: boardColor }}>
                  {currentBoard || 'Not set'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
