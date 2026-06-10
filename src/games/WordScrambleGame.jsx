/**
 * @file WordScrambleGame.jsx
 * @description Unscramble key GCSE vocabulary words.
 */
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function scramble(word) { return word.split('').sort(() => Math.random() - 0.5).join(''); }

export default function WordScrambleGame() {
  const { saveScore, gcseWords } = useAppContext();
  const [wordObj,   setWordObj]   = useState(null);
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score,     setScore]     = useState(0);
  const [streak,    setStreak]    = useState(0);
  const [result,    setResult]    = useState(null); // null | 'correct' | 'wrong' | 'skipped'
  const inputRef = useRef(null);

  function nextWord() {
    if (!gcseWords.length) return;
    const w = gcseWords[Math.floor(Math.random() * gcseWords.length)];
    let s = scramble(w.word);
    while (s === w.word) s = scramble(w.word);
    setWordObj(w);
    setScrambled(s);
    setUserInput('');
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  useEffect(() => { nextWord(); }, []);

  function check() {
    if (!wordObj || result) return;
    const ans    = userInput.trim().toUpperCase().replace(/\s+/g, '');
    const target = wordObj.word.replace(/\s+/g, '');
    if (ans === target) {
      const newScore = score + 1, newStreak = streak + 1;
      setScore(newScore); setStreak(newStreak);
      setResult('correct');
      saveScore('Word Scramble', newScore, 'scramble');
      setTimeout(nextWord, 1500);
    } else {
      setStreak(0);
      setResult('wrong');
    }
  }

  function skip() {
    setStreak(0);
    setResult('skipped');
    setTimeout(nextWord, 1500);
  }

  const resultStyle = result === 'correct'
    ? { background: 'rgba(0,201,167,.1)', border: '1px solid var(--teal)', color: 'var(--teal)' }
    : result === 'wrong'
    ? { background: 'rgba(255,107,107,.08)', border: '1px solid var(--coral)', color: 'var(--coral)' }
    : { color: 'var(--slate)' };

  const resultText = result === 'correct'
    ? `✅ Correct! "${wordObj?.word}"`
    : result === 'wrong'
    ? '✗ Not quite. Try again!'
    : result === 'skipped'
    ? `Skipped — answer was: ${wordObj?.word}`
    : '';

  return (
    <div id="screen-scramble" className="screen active">
      <div className="game-wrap">
        <div className="game-header">
          <div className="game-title">🔤 Word Scramble</div>
          <div className="game-stats">
            <div className="stat-box">Score <span className="stat-val stat-gold">{score}</span></div>
            <div className="stat-box">Streak 🔥<span className="stat-val stat-coral">{streak}</span></div>
          </div>
        </div>
        {wordObj && (
          <>
            <div className="scramble-word">{scrambled}</div>
            <div className="scramble-clue">💡 {wordObj.clue} <span style={{ color: 'var(--slate)' }}>({wordObj.subject})</span></div>
            <input
              ref={inputRef}
              className="scramble-input"
              maxLength={30}
              placeholder="TYPE YOUR ANSWER…"
              autoComplete="off"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') check(); }}
            />
            {result && <div className="scramble-result" style={resultStyle}>{resultText}</div>}
            <div className="btn-row mt" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={check}>Check ✓</button>
              <button className="btn btn-ghost"   onClick={skip}>Skip →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
