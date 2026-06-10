/**
 * @file PracticeScreen.jsx
 * @description Topic practice screen: subtopic picker, AI question generation, answer submission, marking.
 */
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { callAI, parseJSON } from '../api/ai';
import SourceBar from '../components/SourceBar';
import FeedbackCard from '../components/FeedbackCard';

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function qHtml(text) {
  return (text || '').replace(/\\n/g, '\n').split('\n').map(l => `<p style="margin-bottom:5px">${l}</p>`).join('');
}

export default function PracticeScreen() {
  const { currentBoard, screenParams, boardsData, specData, aoDesc, subjectLabels, topicBankMap, questionBank, boardColors } = useAppContext();
  const { subject, topic } = screenParams;

  function bankQsForTopic(t) {
    const list = topicBankMap[t] || [];
    return questionBank.filter(q => list.includes(q.topic));
  }

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [question,    setQuestion]    = useState(null);
  const [answer,      setAnswer]      = useState('');
  const [feedback,    setFeedback]    = useState(null);
  const [loadingQ,    setLoadingQ]    = useState(false);
  const [loadingFb,   setLoadingFb]   = useState(false);
  const [qError,      setQError]      = useState(null);

  // Topic bank mode
  const [bankMode,    setBankMode]    = useState(false);
  const [tbQs,        setTbQs]        = useState([]);
  const [tbIdx,       setTbIdx]       = useState(0);
  const [tbScore,     setTbScore]     = useState(0);
  const [tbRevealed,  setTbRevealed]  = useState(false);

  const subtopics  = boardsData[currentBoard]?.[subject]?.[topic] || [];
  const bankQs     = subject === 'maths' ? bankQsForTopic(topic) : [];
  const boardColor = boardColors[currentBoard];

  async function loadQ(idx) {
    setLoadingQ(true);
    setQuestion(null);
    setFeedback(null);
    setAnswer('');
    setQError(null);
    try {
      const st = subtopics[idx];
      const marks = rnd(st.marks);
      const tier  = rnd(st.tiers);
      const spec  = specData[currentBoard]?.[subject];
      let prompt  = `Exam board: ${currentBoard}\nSpec: ${spec}\nPaper: ${st.paper}\nQ ref: ${st.qRef}\nMarks: ${marks}\nTier: ${tier}\nAOs: ${st.aos.join(', ')}\nCalculator: ${st.calc}\nTopic: ${st.key}\n`;
      if (subject === 'maths')       prompt += 'Use realistic numbers. Label multi-part a) b) c). No answers.';
      else if (subject === 'language') prompt += 'Include extract for reading Qs. Give clear form/purpose/audience for writing Qs.';
      else                             prompt += "Follow this board's Literature conventions. Extract-based: write realistic extract in author's style. Essay-only: no extract.";
      const text = await callAI(
        `You are an experienced ${currentBoard} GCSE examiner. Generate a question indistinguishable from real ${currentBoard} GCSE papers. Return ONLY valid JSON:\n{"question":"full text with \\n line breaks","marks":N,"tier":"Foundation|Higher","hint":"one-sentence mark-scheme hint"}`,
        prompt, 1200
      );
      setQuestion(parseJSON(text));
    } catch {
      setQError('Error generating question.');
    } finally {
      setLoadingQ(false);
    }
  }

  async function submitAnswer(idx) {
    if (!answer.trim()) { alert('Write an answer first!'); return; }
    setLoadingFb(true);
    setFeedback(null);
    try {
      const st  = subtopics[idx];
      const aoD = st.aos.map(a => `${a}: ${aoDesc[a] || a}`).join('; ');
      const text = await callAI(
        `You are an experienced ${currentBoard} GCSE examiner. Mark responses accurately. Return JSON only.`,
        `Board: ${currentBoard}\nSpec: ${specData[currentBoard]?.[subject]}\nPaper: ${st.paper} — ${st.qRef}\nAOs: ${aoD}\nMarks: ${question.marks}\nStudent answer: """${answer}"""\nReturn ONLY valid JSON:\n{"score":N,"outOf":${question.marks},"grade":"Excellent|Good|Satisfactory|Needs Improvement","feedback":"2–3 examiner sentences","aoBreakdown":[{"ao":"AO1","comment":"brief"}],"improvements":"1–2 specific improvements","modelAnswer":"top-band model answer"}`,
        1200
      );
      setFeedback(parseJSON(text));
    } catch {
      setLoadingFb(false);
    } finally {
      setLoadingFb(false);
    }
  }

  function startTopicBank() {
    setBankMode(true);
    const shuffled = [...bankQs].sort(() => Math.random() - 0.5);
    setTbQs(shuffled);
    setTbIdx(0);
    setTbScore(0);
    setTbRevealed(false);
    setSelectedIdx(null);
  }

  const info = subjectLabels[subject] || {};

  return (
    <div id="screen-practice" className="screen active">
      <div className="practice-wrap">
        <div style={{ marginBottom: 20 }}>
          <div className="section-title">{info.label} — {topic}</div>
          <div className="section-sub">{currentBoard} · {specData[currentBoard]?.[subject]} · Choose a question type.</div>
        </div>

        {/* Subtopic picker */}
        <div className="topic-grid">
          {bankQs.length > 0 && (
            <button
              className={`topic-btn${bankMode ? ' selected' : ''}`}
              style={{ borderColor: 'rgba(230,57,70,.4)' }}
              onClick={startTopicBank}
            >
              <span>🗂️ Quick-fire bank questions</span>
              <span className="ref">{bankQs.length} instant questions · Nov 2024 1F structure</span>
            </button>
          )}
          {subtopics.map((st, i) => (
            <button
              key={i}
              className={`topic-btn${!bankMode && selectedIdx === i ? ' selected' : ''}`}
              onClick={() => { setBankMode(false); setSelectedIdx(i); loadQ(i); }}
            >
              <span>{st.name}</span>
              <span className="ref">{st.paper} · {st.qRef}</span>
            </button>
          ))}
        </div>

        {/* Bank mode */}
        {bankMode && (
          <BankPanel
            qs={tbQs} idx={tbIdx} score={tbScore} revealed={tbRevealed}
            onReveal={() => setTbRevealed(true)}
            onGot={()    => { setTbScore(s => s + 1); setTbIdx(i => i + 1); setTbRevealed(false); }}
            onMiss={()   => { setTbIdx(i => i + 1);   setTbRevealed(false); }}
            onSkip={()   => { setTbIdx(i => i + 1);   setTbRevealed(false); }}
            onRestart={()=> { setTbIdx(0); setTbScore(0); setTbRevealed(false); setTbQs(q => [...q].sort(() => Math.random() - .5)); }}
          />
        )}

        {/* AI question mode */}
        {!bankMode && selectedIdx !== null && (
          <div className="q-area">
            {loadingQ && <div className="loading"><div className="spinner" /> Generating {currentBoard}-style question…</div>}
            {qError && (
              <div className="q-card">
                <p style={{ color: 'var(--coral)' }}>{qError}</p>
                <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => loadQ(selectedIdx)}>Retry</button>
              </div>
            )}
            {!loadingQ && question && (
              <>
                <SourceBar
                  cols={[
                    { label: 'Spec',  value: specData[currentBoard]?.[subject] },
                    { label: 'Paper', value: subtopics[selectedIdx].paper },
                    { label: 'AOs',   value: <>{subtopics[selectedIdx].aos.map(a => <span key={a} className="ao-pill">{a}</span>)}</> },
                    { label: 'Calc',  value: subtopics[selectedIdx].calc, small: true },
                  ]}
                  badge={{ label: currentBoard, color: boardColor }}
                />
                <div className="q-card">
                  <div className="q-header">
                    <span className={`q-tag ${info.color}`}>{info.label}</span>
                    <span className="q-tag" style={{ background: 'rgba(255,255,255,.05)', color: 'var(--slate)' }}>
                      {subtopics[selectedIdx].name}
                    </span>
                    <span className="q-marks">[{question.marks} marks] · {question.tier}</span>
                  </div>
                  <div className="q-text" dangerouslySetInnerHTML={{ __html: qHtml(question.question) }} />
                  <div className="hint-bar">💡 <span>{question.hint}</span></div>
                  <textarea
                    className="ans-box"
                    placeholder="Write your answer here…"
                    style={{ minHeight: question.marks >= 20 ? 220 : question.marks >= 8 ? 160 : 100 }}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                  <div className="btn-row" style={{ marginTop: 10 }}>
                    <button className="btn btn-primary" onClick={() => submitAnswer(selectedIdx)} disabled={loadingFb}>
                      Submit Answer
                    </button>
                    <button className="btn btn-ghost" onClick={() => loadQ(selectedIdx)}>New Question</button>
                  </div>
                </div>
                {loadingFb && <div className="loading"><div className="spinner" /> Marking against {currentBoard} mark scheme…</div>}
                {feedback && (
                  <FeedbackCard
                    feedback={feedback}
                    board={currentBoard}
                    onNext={() => loadQ(selectedIdx)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BankPanel({ qs, idx, score, revealed, onReveal, onGot, onMiss, onSkip, onRestart }) {
  if (idx >= qs.length) {
    return (
      <div className="q-card center">
        <div style={{ fontSize: '2.5rem' }}>🎉</div>
        <div className="section-title mt">Topic bank complete!</div>
        <p style={{ color: 'var(--slate)', margin: '8px 0' }}>
          Self-marked: <strong style={{ color: 'var(--teal)' }}>{score}</strong> / {qs.length}
        </p>
        <button className="btn btn-primary mt" onClick={onRestart}>Go Again</button>
      </div>
    );
  }
  const q = qs[idx];
  return (
    <div className="q-area">
      <SourceBar
        cols={[
          { label: 'Slot style', value: `${q.slot} · Nov 2024 1F` },
          { label: 'Topic',      value: q.topic, small: true },
          { label: 'Progress',   value: `${idx + 1} / ${qs.length}` },
        ]}
        badge={{ label: 'Instant bank', color: '#e63946' }}
      />
      <div className="q-card">
        <div className="q-header">
          <span className="q-tag tag-maths">Mathematics</span>
          <span className="q-marks">[{q.marks} mark{q.marks > 1 ? 's' : ''}] · Foundation</span>
        </div>
        <div className="q-text">{q.q}</div>
        <textarea className="ans-box" placeholder="Work it out here (optional)…" style={{ minHeight: 80 }} />
        {!revealed && (
          <div className="btn-row" style={{ marginTop: 10 }}>
            <button className="btn btn-primary" onClick={onReveal}>Reveal Answer</button>
            <button className="btn btn-ghost"   onClick={onSkip}>Skip →</button>
          </div>
        )}
        {revealed && (
          <>
            <div className="model-ans mt">{q.a}</div>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn-got-it" onClick={onGot}>✓ Got it</button>
              <button className="btn-missed" onClick={onMiss}>✗ Missed</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
