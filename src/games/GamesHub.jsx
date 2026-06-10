/**
 * @file GamesHub.jsx
 * @description Games hub overview screen with cards for each game.
 */
import { useAppContext } from '../context/AppContext';

const GAMES = [
  { id: 'flashcard',   icon: 'address-card', title: 'Flashcards',       desc: 'Flip through key terms, definitions and methods. Chill revision at your own pace.',    diff: 'Relaxed',   color: '#00c9a7' },
  { id: 'speed',       icon: 'bolt',         title: 'Speed Round',       desc: '60 seconds. Answer as many AI questions as you can. Race the clock.',                  diff: 'Intense',   color: '#f5c842' },
  { id: 'gte',         icon: 'bullseye',     title: 'Beat the Examiner', desc: 'Climb the grade ladder from Grade 1 to 9. Lose 3 lives and you\'re out.',              diff: 'Challenge', color: '#a78bfa' },
  { id: 'scramble',    icon: 'font',         title: 'Word Scramble',     desc: 'Unscramble key GCSE vocabulary. Great for getting terms to stick.',                    diff: 'Relaxed',   color: '#f5c842' },
  { id: 'match',       icon: 'puzzle-piece', title: 'Match-Up',          desc: 'Connect terms to definitions in the fewest clicks. Can you go perfect?',               diff: 'Strategy',  color: '#ff6b6b' },
  { id: 'leaderboard', icon: 'trophy',       title: 'Leaderboard',       desc: 'Track your personal bests across all five games. Beat your own records.',              diff: 'Records',   color: '#f0f4f8' },
];

export default function GamesHub() {
  const { startGame, showScreen } = useAppContext();

  function handleCard(id) {
    if (id === 'leaderboard') showScreen('leaderboard');
    else startGame(id);
  }

  return (
    <div id="screen-games" className="screen active">
      <div className="games-hub">
        <div className="games-hero">
          <h2><i className="fa-solid fa-gamepad" /> Games Hub</h2>
          <p>Revision doesn't have to be boring. Five ways to make it stick.</p>
        </div>
        <div className="games-grid">
          {GAMES.map(g => (
            <div
              key={g.id}
              className="game-card"
              style={{ '--game-color': g.color }}
              onClick={() => handleCard(g.id)}
            >
              <span className="game-icon"><i className={`fa-solid fa-${g.icon}`} /></span>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <div className="game-meta">
                <span className="diff-badge">{g.diff}</span>
                <button className="play-btn" style={{ background: g.color }}>
                  {g.id === 'leaderboard' ? 'View →' : 'Play →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
