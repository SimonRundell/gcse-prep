/**
 * @file LeaderboardScreen.jsx
 * @description Personal best scores and recent score history.
 */
import { useAppContext } from '../context/AppContext';

function rankClass(i) { return i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''; }

export default function LeaderboardScreen() {
  const { scores, clearScores } = useAppContext();

  if (!scores.length) {
    return (
      <div id="screen-leaderboard" className="screen active">
        <div style={{ maxWidth: 680 }}>
          <div className="section-title">🏆 Leaderboard</div>
          <div className="section-sub">Your personal high scores. Saved in this browser.</div>
          <div className="leaderboard"><div className="lb-empty">No scores yet — play some games!</div></div>
        </div>
      </div>
    );
  }

  // Personal bests: highest score per game type
  const bestMap = {};
  scores.forEach(s => {
    if (!bestMap[s.type] || s.score > bestMap[s.type].score) bestMap[s.type] = s;
  });
  const bests   = Object.values(bestMap).sort((a, b) => b.score - a.score);
  const recent  = scores.slice(0, 15);

  return (
    <div id="screen-leaderboard" className="screen active">
      <div style={{ maxWidth: 680 }}>
        <div className="section-title">🏆 Leaderboard</div>
        <div className="section-sub">Your personal high scores. Saved in this browser.</div>

        <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--teal)', marginBottom: 10 }}>Personal Bests</div>
        <div className="leaderboard">
          <div className="lb-header"><div>#</div><div>Game</div><div>Score</div><div>Type</div><div>Date</div></div>
          {bests.map((s, i) => (
            <div key={i} className="lb-row">
              <div className={`lb-rank ${rankClass(i)}`}>{i + 1}</div>
              <div className="lb-name">{s.game}</div>
              <div className="lb-score" style={{ color: 'var(--gold)' }}>{s.score}</div>
              <div className="lb-game">Best</div>
              <div className="lb-date">{s.date}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--slate)', margin: '18px 0 10px' }}>Recent Scores</div>
        <div className="leaderboard">
          <div className="lb-header"><div>#</div><div>Game</div><div>Score</div><div>Type</div><div>Date</div></div>
          {recent.map((s, i) => (
            <div key={i} className="lb-row">
              <div className="lb-rank">{i + 1}</div>
              <div className="lb-name">{s.game}</div>
              <div className="lb-score">{s.score}</div>
              <div className="lb-game" style={{ color: 'var(--purple)' }}>{s.game}</div>
              <div className="lb-date">{s.date}</div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-ghost mt"
          onClick={() => { if (confirm('Clear all scores?')) clearScores(); }}
        >
          Clear scores
        </button>
      </div>
    </div>
  );
}
