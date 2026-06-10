/**
 * @file Sidebar.jsx
 * @description Left navigation sidebar.
 */
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const {
    currentScreen, screenParams,
    showScreen, showPractice, startGame, initRealPaper, initQBank,
  } = useAppContext();

  const is = (screen) => currentScreen === screen ? 'nav-item active' : 'nav-item';
  const isPractice = (subject, topic) =>
    currentScreen === 'practice' && screenParams.subject === subject && screenParams.topic === topic
      ? 'nav-item active' : 'nav-item';

  return (
    <aside>
      <div className="sidebar-label">Home</div>
      <button className={is('home')}      onClick={() => showScreen('home')}>
        <span className="icon">🏠</span> Dashboard
      </button>

      <div className="sidebar-label">Study</div>
      <button className={isPractice('maths','Number')}     onClick={() => showPractice('maths','Number')}>
        <span className="icon">🔢</span> Number <span className="pill pill-m">M</span>
      </button>
      <button className={isPractice('maths','Algebra')}    onClick={() => showPractice('maths','Algebra')}>
        <span className="icon">📐</span> Algebra <span className="pill pill-m">M</span>
      </button>
      <button className={isPractice('maths','Geometry')}   onClick={() => showPractice('maths','Geometry')}>
        <span className="icon">📏</span> Geometry <span className="pill pill-m">M</span>
      </button>
      <button className={isPractice('maths','Statistics')} onClick={() => showPractice('maths','Statistics')}>
        <span className="icon">📊</span> Statistics <span className="pill pill-m">M</span>
      </button>
      <button className={isPractice('language','Reading')}     onClick={() => showPractice('language','Reading')}>
        <span className="icon">📖</span> Reading <span className="pill pill-el">EL</span>
      </button>
      <button className={isPractice('language','Writing')}     onClick={() => showPractice('language','Writing')}>
        <span className="icon">✍️</span> Writing <span className="pill pill-el">EL</span>
      </button>
      <button className={isPractice('literature','Shakespeare')} onClick={() => showPractice('literature','Shakespeare')}>
        <span className="icon">🎭</span> Shakespeare <span className="pill pill-lit">LIT</span>
      </button>
      <button className={isPractice('literature','Poetry')}     onClick={() => showPractice('literature','Poetry')}>
        <span className="icon">🌹</span> Poetry <span className="pill pill-lit">LIT</span>
      </button>
      <button className={is('mock')}       onClick={() => showScreen('mock')}>
        <span className="icon">📋</span> Mock Exam
      </button>
      <button className={is('realpaper')}  onClick={initRealPaper}>
        <span className="icon">📄</span> Real Paper Mode <span className="pill pill-m">AQA</span>
      </button>
      <button className={is('qbank')}      onClick={initQBank}>
        <span className="icon">🗂️</span> Question Bank <span className="pill pill-m">100+</span>
      </button>
      <button className={is('videos')}     onClick={() => showScreen('videos')}>
        <span className="icon">🎬</span> Video Lessons <span className="pill pill-el">NEW</span>
      </button>

      <div className="sidebar-label">Games</div>
      <button className={is('games')}     onClick={() => showScreen('games')}>
        <span className="icon">🎮</span> Games Hub <span className="pill pill-game">NEW</span>
      </button>
      <button className={is('flashcard')} onClick={() => startGame('flashcard')}>
        <span className="icon">🃏</span> Flashcards <span className="pill pill-game">🎮</span>
      </button>
      <button className={is('speed')}     onClick={() => startGame('speed')}>
        <span className="icon">⚡</span> Speed Round <span className="pill pill-game">🎮</span>
      </button>
      <button className={is('gte')}       onClick={() => startGame('gte')}>
        <span className="icon">🎯</span> Beat Examiner <span className="pill pill-game">🎮</span>
      </button>
      <button className={is('scramble')}  onClick={() => startGame('scramble')}>
        <span className="icon">🔤</span> Word Scramble <span className="pill pill-game">🎮</span>
      </button>
      <button className={is('match')}     onClick={() => startGame('match')}>
        <span className="icon">🧩</span> Match-Up <span className="pill pill-game">🎮</span>
      </button>
      <button className={is('leaderboard')} onClick={() => showScreen('leaderboard')}>
        <span className="icon">🏆</span> Leaderboard
      </button>
    </aside>
  );
}
