/**
 * @file SpeedRoundGame.jsx
 * @description 60-second rapid-fire question game. Mix of instant bank questions and AI questions.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { callAI, parseJSON } from '../api/ai';

const CIRCUMFERENCE = 2 * Math.PI * 36; // r=36

function normAns(s) { return s.toLowerCase().replace(/[^a-z0-9./]/g, ''); }

export default function SpeedRoundGame() {
  const { currentBoard, saveScore, questionBank, blueprint } = useAppContext();
  const [phase,    setPhase]    = useState('intro'); // 'intro' | 'playing' | 'ended'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score,    setScore]    = useState(0);
  const [best,     setBest]     = useState(() => parseInt(localStorage.getItem('srBest') || '0'));
  const [qText,    setQText]    = useState('');
  const [fbText,   setFbText]   = useState('');
  const [fbClass,  setFbClass]  = useState('');
  const [input,    setInput]    = useState('');

  const timerRef   = useRef(null);
  const scoreRef   = useRef(0);
  const currentQ   = useRef('');
  const currentA   = useRef('');
  const phaseRef   = useRef('intro');
  const inputRef   = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const showFeedback = useCallback((correct, modelAnswer) => {
    setFbText(correct
      ? <><i className="fa-solid fa-check" /> Correct! +1</>
      : <><i className="fa-solid fa-xmark" /> Answer: {modelAnswer}</>);
    setFbClass(correct ? 'speed-feedback correct-flash' : 'speed-feedback wrong-flash');
    setTimeout(() => { setFbText(''); setFbClass('speed-feedback'); }, 1200);
  }, []);

  const loadQ = useCallback(async () => {
    const shortBank = questionBank.filter(q => q.marks <= 2);
    if (Math.random() < 0.7 && shortBank.length) {
      const q = shortBank[Math.floor(Math.random() * shortBank.length)];
      currentQ.current = q.q;
      currentA.current = q.a;
      setQText(q.q);
      setInput('');
      inputRef.current?.focus();
      return;
    }
    const useBP  = currentBoard === 'AQA' && Math.random() < 0.6;
    const bpItem = useBP ? blueprint[Math.floor(Math.random() * blueprint.length)] : null;
    const topicLine = bpItem
      ? `Base it on this topic: ${bpItem.topic}. Make it answerable in one short line.`
      : 'Generate a varied GCSE short-answer question about maths, English language or literature.';
    try {
      const text = await callAI(
        'You are a GCSE examiner. Generate a short-answer question with a concise answer. Return ONLY JSON: {"question":"short question (1 sentence)","answer":"brief model answer (max 15 words)","subject":"maths|language|literature"}',
        `Board: ${currentBoard}. ${topicLine} Keep both question and answer very concise.`,
        400
      );
      const d = parseJSON(text);
      if (phaseRef.current !== 'playing') return;
      currentQ.current = d.question;
      currentA.current = d.answer;
      setQText(d.question);
      setInput('');
      inputRef.current?.focus();
    } catch { /* continue silently */ }
  }, [currentBoard, questionBank, blueprint]);

  function endRound() {
    phaseRef.current = 'ended';
    clearInterval(timerRef.current);
    const final = scoreRef.current;
    if (final > best) {
      setBest(final);
      localStorage.setItem('srBest', String(final));
    }
    saveScore('Speed Round', final, 'speed');
    setPhase('ended');
  }

  function startRound() {
    scoreRef.current = 0;
    phaseRef.current = 'playing';
    setScore(0);
    setTimeLeft(60);
    setPhase('playing');
    setFbText(''); setFbClass('speed-feedback');
    loadQ();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endRound(); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function checkAnswer() {
    const ans = input.trim();
    if (!ans) return;
    const na = normAns(ans), nm = normAns(currentA.current);
    if (na && nm && (na === nm || (nm.includes(na) && na.length >= 2))) {
      scoreRef.current++;
      setScore(scoreRef.current);
      showFeedback(true, '');
      setInput('');
      loadQ();
      return;
    }
    try {
      const text = await callAI(
        'You are a GCSE marker. Is the student answer basically correct for this question? Return ONLY JSON: {"correct":true,"points":1}',
        `Question: ${currentQ.current}\nModel answer: ${currentA.current}\nStudent answer: ${ans}\nReturn {"correct":true|false,"points":1}`,
        200
      );
      const d = parseJSON(text);
      if (d.correct) {
        scoreRef.current++;
        setScore(scoreRef.current);
        showFeedback(true, '');
      } else {
        showFeedback(false, currentA.current);
      }
    } catch {
      showFeedback(false, currentA.current);
    }
    setInput('');
    loadQ();
  }

  const pct = timeLeft / 60;
  const dashOffset = CIRCUMFERENCE * (1 - pct);
  const ringColor = timeLeft > 20 ? 'var(--teal)' : timeLeft > 10 ? 'var(--gold)' : 'var(--coral)';

  if (phase === 'ended') {
    return (
      <div id="screen-speed" className="screen active">
        <div className="game-wrap center" style={{ paddingTop: 32 }}>
          <div style={{ fontSize: '3rem' }}><i className="fa-solid fa-bolt" /></div>
          <div className="result-big" style={{ color: 'var(--gold)' }}>{score}</div>
          <div style={{ color: 'var(--slate)', marginBottom: 8 }}>questions answered</div>
          {score >= best && score > 0 && (
            <div style={{ color: 'var(--teal)', fontWeight: 700, marginBottom: 16 }}><i className="fa-solid fa-trophy" /> New personal best!</div>
          )}
          <button type="button" className="btn btn-primary" onClick={startRound}>Play Again</button>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div id="screen-speed" className="screen active">
        <div className="game-wrap">
          <div className="game-header">
            <div className="game-title"><i className="fa-solid fa-bolt" /> Speed Round</div>
            <div className="game-stats">
              <div className="stat-box">Score <span className="stat-val stat-gold">{score}</span></div>
              <div className="stat-box">Best <span className="stat-val stat-teal">{best}</span></div>
            </div>
          </div>
          <div className="speed-display center">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}><i className="fa-solid fa-bolt" /></div>
            <div className="section-title">60 seconds.</div>
            <p style={{ color: 'var(--slate)', margin: '10px 0' }}>Answer as many {currentBoard} questions as you can before time runs out.</p>
            <div style={{ marginTop: 8, fontSize: '.8rem', color: 'var(--slate)' }}>Short answers only — key points score points!</div>
          </div>
          <button type="button" className="btn btn-primary mt" style={{ width: '100%' }} onClick={startRound}>Start Round <i className="fa-solid fa-arrow-right" /></button>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-speed" className="screen active">
      <div className="game-wrap">
        <div className="game-header">
          <div className="game-title"><i className="fa-solid fa-bolt" /> Speed Round</div>
          <div className="game-stats">
            <div className="stat-box">Score <span className="stat-val stat-gold">{score}</span></div>
            <div className="stat-box">Best <span className="stat-val stat-teal">{best}</span></div>
          </div>
        </div>
        <div className="speed-display">
          <div className="timer-ring">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle className="ring-bg" cx="40" cy="40" r="36" />
              <circle
                className="ring-fg"
                cx="40" cy="40" r="36"
                style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset, stroke: ringColor }}
              />
            </svg>
            <div className="timer-number">{timeLeft}</div>
          </div>
          <div className="speed-question">{qText || <span className="loading"><span className="spinner" /> Loading…</span>}</div>
          <input
            ref={inputRef}
            className="speed-input"
            placeholder="Type your answer and press Enter…"
            autoComplete="off"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer(); }}
          />
          <div className={fbClass || 'speed-feedback'}>{fbText}</div>
        </div>
      </div>
    </div>
  );
}
