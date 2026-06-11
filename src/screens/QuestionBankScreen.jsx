/**
 * @file QuestionBankScreen.jsx
 * @description 100+ pre-built practice questions with topic filter and self-marking.
 */
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor';

export default function QuestionBankScreen() {
  const { saveScore, questionBank } = useAppContext();
  const ALL_TOPICS = [...new Set(questionBank.map(q => q.topic))];
  const [started,   setStarted]   = useState(false);
  const [filter,    setFilter]    = useState(null);
  const [qbList,    setQbList]    = useState([]);
  const [qbIdx,     setQbIdx]     = useState(0);
  const [qbScore,   setQbScore]   = useState(0);
  const [revealed,  setRevealed]  = useState(false);

  function startBank(topic) {
    const filtered = topic
      ? questionBank.filter(q => q.topic === topic)
      : [...questionBank];
    setFilter(topic);
    setQbList([...filtered].sort(() => Math.random() - 0.5));
    setQbIdx(0);
    setQbScore(0);
    setRevealed(false);
    setStarted(true);
  }

  function handleGot()  { const s = qbScore + 1; setQbScore(s); advance(); }
  function handleMiss() { advance(); }
  function handleSkip() { advance(); }
  function advance()    { setQbIdx(i => i + 1); setRevealed(false); }

  function handleComplete() {
    saveScore('Question Bank', qbScore, 'qbank');
    setStarted(false);
  }

  if (!started) {
    return (
      <div id="screen-qbank" className="screen active">
        <div className="practice-wrap">
          <div className="section-title"><i className="fa-solid fa-layer-group" /> Question Bank</div>
          <div className="section-sub">100+ ready-made practice questions following the Nov 2024 Paper 1F structure — instant, no waiting. Reveal answers when you're ready.</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '.78rem', color: 'var(--slate)', marginBottom: 8, fontWeight: 600 }}>Filter by topic (or take them all on):</div>
            <div className="topic-chips">
              <span className="topic-chip" style={{ borderColor: 'var(--teal)', color: 'var(--teal)' }} onClick={() => startBank(null)}>
                <i className="fa-solid fa-dice" /> All {questionBank.length} questions (shuffled)
              </span>
              {ALL_TOPICS.map(t => (
                <span key={t} className="topic-chip" onClick={() => startBank(t)}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (qbIdx >= qbList.length) {
    return (
      <div id="screen-qbank" className="screen active">
        <div className="practice-wrap">
          <div className="center" style={{ padding: '32px 0' }}>
            <div style={{ fontSize: '3rem' }}><i className="fa-solid fa-layer-group" /></div>
            <div className="section-title mt">Set complete!</div>
            <p style={{ color: 'var(--slate)', margin: '10px 0' }}>
              Self-marked: <strong style={{ color: 'var(--teal)' }}>{qbScore}</strong> / {qbList.length} correct
            </p>
            <button type="button" className="btn btn-primary mt" onClick={handleComplete}>Choose Another Set</button>
          </div>
        </div>
      </div>
    );
  }

  const q = qbList[qbIdx];
  return (
    <div id="screen-qbank" className="screen active">
      <div className="practice-wrap">
        <div className="section-title"><i className="fa-solid fa-layer-group" /> Question Bank</div>
        <div className="section-sub">100+ ready-made practice questions — reveal the answer when you're ready.</div>
        <div className="q-area">
          <div className="source-bar">
            <div className="src-col"><span className="src-lbl">Slot style</span><span className="src-val">{q.slot} · Nov 2024 1F structure</span></div>
            <div className="src-div" />
            <div className="src-col"><span className="src-lbl">Topic</span><span className="src-val" style={{ fontSize: '.76rem' }}>{q.topic}</span></div>
            <div className="src-div" />
            <div className="src-col"><span className="src-lbl">Progress</span><span className="src-val">{qbIdx + 1} / {qbList.length}</span></div>
            <span className="board-badge" style={{ color: '#e63946', borderColor: '#e63946', background: 'rgba(0,0,0,.2)' }}>Practice bank</span>
          </div>
          <div className="q-card">
            <div className="q-header">
              <span className="q-tag tag-maths">Mathematics</span>
              <span className="q-marks">[{q.marks} mark{q.marks > 1 ? 's' : ''}] · Foundation · Non-calc</span>
            </div>
            <div className="q-text">{q.q}</div>
            <RichTextEditor key={qbIdx} placeholder="Work it out here (optional)…" minHeight={80} />
            {!revealed && (
              <div className="btn-row" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn-primary" onClick={() => setRevealed(true)}>Reveal Answer</button>
                <button type="button" className="btn btn-ghost" onClick={handleSkip}>Skip <i className="fa-solid fa-arrow-right" /></button>
              </div>
            )}
            {revealed && (
              <>
                <div className="model-ans mt" style={{ animation: 'fadeIn .3s ease' }}>{q.a}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--slate)', marginTop: 12, fontWeight: 600 }}>Did you get it right?</div>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <button type="button" className="btn-got-it" onClick={handleGot}><i className="fa-solid fa-check" /> Got it</button>
                  <button type="button" className="btn-missed" onClick={handleMiss}><i className="fa-solid fa-xmark" /> Missed it</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
