/**
 * @file BeatTheExaminerGame.jsx
 * @description Climb the grade ladder from 1 to 9 with multiple-choice questions. Lose 3 lives and it's over.
 */
import { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { callAI, parseJSON } from '../api/ai';

const GRADES     = ['1','2','3','4','5','6','7','8','9'];
const GRADE_REQS = [2, 2, 3, 3, 3, 4, 4, 4, 4];

export default function BeatTheExaminerGame() {
  const { currentBoard, saveScore, blueprint } = useAppContext();
  const [phase,    setPhase]    = useState('intro');  // 'intro' | 'playing' | 'won' | 'lost'
  const [grade,    setGrade]    = useState(0);
  const [lives,    setLives]    = useState(3);
  const [correct,  setCorrect]  = useState(0);
  const [question, setQuestion] = useState(null);
  const [chosen,   setChosen]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const gradeRef   = useRef(0);
  const livesRef   = useRef(3);
  const correctRef = useRef(0);

  function reset() {
    gradeRef.current = 0; livesRef.current = 3; correctRef.current = 0;
    setGrade(0); setLives(3); setCorrect(0); setQuestion(null); setChosen(null);
    setPhase('intro');
  }

  async function loadQ() {
    setLoading(true);
    setQuestion(null);
    setChosen(null);
    const g    = gradeRef.current;
    const diff = g <= 2 ? 'easy Foundation' : g <= 5 ? 'mid Foundation/Higher' : g <= 7 ? 'difficult Higher' : 'very challenging Higher';
    const useBP  = currentBoard === 'AQA' && Math.random() < 0.5;
    const bpItem = useBP ? blueprint[Math.floor(Math.random() * blueprint.length)] : null;
    const topicLine = bpItem
      ? `Base it on this real AQA Nov 2024 Paper 1F topic: ${bpItem.topic} (style: ${bpItem.style}).`
      : 'Generate a varied GCSE question (Maths, English Language or Literature).';
    try {
      const text = await callAI(
        'You are a GCSE examiner creating multiple-choice questions. Return ONLY valid JSON, no markdown.',
        `Board: ${currentBoard}. Difficulty: ${diff} (targeting Grade ${GRADES[g]}).\n${topicLine}\nReturn ONLY: {"question":"the question text","options":["A","B","C","D"],"correct":0,"explanation":"why the correct answer is right"}`,
        600
      );
      setQuestion(parseJSON(text));
    } catch { setQuestion(null); }
    setLoading(false);
  }

  function start() { setPhase('playing'); loadQ(); }

  function answer(chosenIdx) {
    if (chosen !== null) return;
    setChosen(chosenIdx);
    const correct_idx = question.correct;
    if (chosenIdx === correct_idx) {
      const newCorrect = correctRef.current + 1;
      correctRef.current = newCorrect;
      setCorrect(newCorrect);
      if (newCorrect >= GRADE_REQS[gradeRef.current]) {
        if (gradeRef.current >= 8) {
          saveScore('Beat the Examiner', 9, 'gte');
          setTimeout(() => setPhase('won'), 600);
          return;
        }
        gradeRef.current++;
        correctRef.current = 0;
        setGrade(gradeRef.current);
        setCorrect(0);
        setTimeout(loadQ, 2200);
      } else {
        setTimeout(loadQ, 2200);
      }
    } else {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      if (newLives <= 0) {
        saveScore('Beat the Examiner', gradeRef.current + 1, 'gte');
        setTimeout(() => setPhase('lost'), 600);
        return;
      }
      setTimeout(loadQ, 2200);
    }
  }

  function Ladder({ currentGrade, currentCorrect, lives: l }) {
    return (
      <div className="grade-ladder">
        {[...GRADES].reverse().map((g, ri) => {
          const i = GRADES.length - 1 - ri;
          const cls = i === currentGrade ? 'grade-rung current' : i < currentGrade ? 'grade-rung passed' : 'grade-rung';
          const col = i === currentGrade ? 'var(--gold)' : i < currentGrade ? 'var(--teal)' : 'var(--slate)';
          const fillW = i < currentGrade ? 100 : i === currentGrade ? Math.round(currentCorrect / GRADE_REQS[i] * 100) : 0;
          const fillC = i === currentGrade ? 'var(--gold)' : 'var(--teal)';
          return (
            <div key={g} className={cls}>
              <div className="rung-grade" style={{ color: col }}>{g}</div>
              <div className="rung-bar"><div className="rung-fill" style={{ width: fillW + '%', background: fillC }} /></div>
              <div className="rung-req">
                {i < currentGrade ? <><i className="fa-solid fa-check" /> Passed</> : i === currentGrade ? `${currentCorrect}/${GRADE_REQS[i]} correct` : `Need ${GRADE_REQS[i]} correct`}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (phase === 'won') {
    return (
      <div id="screen-gte" className="screen active">
        <div className="game-wrap center" style={{ paddingTop: 40 }}>
          <div style={{ fontSize: '3rem' }}><i className="fa-solid fa-trophy" /></div>
          <div className="result-big" style={{ color: 'var(--gold)' }}>Grade 9!</div>
          <p style={{ color: 'var(--slate)', margin: '8px 0' }}>You beat the examiner on every grade!</p>
          <button type="button" className="btn btn-primary mt" onClick={reset}>Play Again</button>
        </div>
      </div>
    );
  }

  if (phase === 'lost') {
    return (
      <div id="screen-gte" className="screen active">
        <div className="game-wrap center" style={{ paddingTop: 40 }}>
          <div style={{ fontSize: '3rem' }}><i className="fa-solid fa-heart-crack" /></div>
          <div className="section-title mt">Game Over</div>
          <p style={{ color: 'var(--slate)', margin: '10px 0' }}>
            You reached <strong style={{ color: 'var(--gold)' }}>Grade {GRADES[grade]}</strong>
          </p>
          <button type="button" className="btn btn-primary mt" onClick={reset}>Try Again</button>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div id="screen-gte" className="screen active">
        <div className="game-wrap">
          <div className="game-header">
            <div className="game-title"><i className="fa-solid fa-bullseye" /> Beat the Examiner</div>
            <div className="game-stats">
              <div className="stat-box">Grade <span className="stat-val stat-purple">{GRADES[grade]}</span></div>
              <div className="stat-box">Lives <span className="lives-display">{[0, 1, 2].map(i => <i key={i} className="fa-solid fa-heart" />)}</span></div>
            </div>
          </div>
          <div style={{ padding: '24px 0 12px' }}>
            <p style={{ color: 'var(--slate)', fontSize: '.88rem', marginBottom: 20 }}>
              Climb from Grade 1 to Grade 9. Answer multiple-choice questions. Get enough right to level up — lose 3 lives and it's game over.
            </p>
            <Ladder currentGrade={0} currentCorrect={0} lives={3} />
          </div>
          <button type="button" className="btn btn-purple" style={{ width: '100%' }} onClick={start}>Start climbing <i className="fa-solid fa-arrow-right" /></button>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-gte" className="screen active">
      <div className="game-wrap">
        <div className="game-header">
          <div className="game-title"><i className="fa-solid fa-bullseye" /> Beat the Examiner</div>
          <div className="game-stats">
            <div className="stat-box">Grade <span className="stat-val stat-purple">{GRADES[grade]}</span></div>
            <div className="stat-box">Lives <span className="lives-display">{[0, 1, 2].map(i => <i key={i} className={`fa-solid fa-heart${i >= lives ? ' lost' : ''}`} />)}</span></div>
          </div>
        </div>
        <Ladder currentGrade={grade} currentCorrect={correct} lives={lives} />
        {loading && <div className="loading"><div className="spinner" /> Generating Grade {GRADES[grade]} question…</div>}
        {!loading && question && (
          <div className="gte-question">
            <div className="gte-q-text">{question.question}</div>
            <div className="gte-options">
              {question.options.map((opt, i) => {
                let cls = 'gte-opt';
                if (chosen !== null) {
                  if (i === question.correct) cls += ' correct';
                  else if (i === chosen)      cls += ' wrong';
                }
                return (
                  <button type="button" key={i} className={cls} disabled={chosen !== null} onClick={() => answer(i)}>
                    {String.fromCharCode(65 + i)}) {opt}
                  </button>
                );
              })}
            </div>
            {chosen !== null && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 8, fontSize: '.82rem', color: '#ccd6e0', animation: 'fadeIn .3s ease' }}>
                <i className="fa-solid fa-lightbulb" /> {question.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
