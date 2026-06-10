/**
 * @file MockScreen.jsx
 * @description Mock exam: a sequential set of AI questions across all three subjects.
 */
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BOARDS, SPEC, AO_DESC, SUBJECT_LABELS, BOARD_COLORS } from '../data/boards';
import { callAI, parseJSON } from '../api/ai';
import SourceBar from '../components/SourceBar';
import FeedbackCard from '../components/FeedbackCard';

const MOCK_SET = [
  { subject: 'maths',      topic: 'Number',      idx: 0 },
  { subject: 'maths',      topic: 'Algebra',      idx: 0 },
  { subject: 'maths',      topic: 'Geometry',     idx: 0 },
  { subject: 'language',   topic: 'Reading',      idx: 1 },
  { subject: 'language',   topic: 'Writing',      idx: 0 },
  { subject: 'literature', topic: 'Shakespeare',  idx: 0 },
  { subject: 'literature', topic: 'Poetry',       idx: 1 },
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function qHtml(t) { return (t||'').replace(/\\n/g,'\n').split('\n').map(l=>`<p style="margin-bottom:5px">${l}</p>`).join(''); }

export default function MockScreen() {
  const { currentBoard } = useAppContext();
  const [started,   setStarted]   = useState(false);
  const [mockIdx,   setMockIdx]   = useState(0);
  const [question,  setQuestion]  = useState(null);
  const [answer,    setAnswer]    = useState('');
  const [feedback,  setFeedback]  = useState(null);
  const [loadingQ,  setLoadingQ]  = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);

  async function startMock() {
    setStarted(true);
    setMockIdx(0);
    await loadMockQ(0);
  }

  async function loadMockQ(idx) {
    if (idx >= MOCK_SET.length) { setQuestion(null); return; }
    setQuestion(null); setFeedback(null); setAnswer('');
    setLoadingQ(true);
    const { subject, topic, idx: stIdx } = MOCK_SET[idx];
    const st = BOARDS[currentBoard][subject][topic][stIdx];
    const marks = rnd(st.marks);
    const tier  = rnd(st.tiers);
    const spec  = SPEC[currentBoard][subject];
    let prompt = `Exam board: ${currentBoard}\nSpec: ${spec}\nPaper: ${st.paper}\nQ ref: ${st.qRef}\nMarks: ${marks}\nTier: ${tier}\nAOs: ${st.aos.join(', ')}\nCalculator: ${st.calc}\nTopic: ${st.key}\n`;
    if (subject === 'maths') prompt += 'Use realistic numbers. Label multi-part a) b) c). No answers.';
    else if (subject === 'language') prompt += 'Include extract for reading Qs.';
    else prompt += "Follow this board's Literature conventions.";
    try {
      const text = await callAI(
        `You are an experienced ${currentBoard} GCSE examiner. Generate a question indistinguishable from real ${currentBoard} GCSE papers. Return ONLY valid JSON:\n{"question":"full text with \\n line breaks","marks":N,"tier":"Foundation|Higher","hint":"one-sentence mark-scheme hint"}`,
        prompt, 1200
      );
      setQuestion({ ...parseJSON(text), _subject: subject, _topic: topic, _stIdx: stIdx });
    } catch { setQuestion(null); }
    setLoadingQ(false);
  }

  async function submitAnswer() {
    if (!answer.trim()) { alert('Write an answer first!'); return; }
    setLoadingFb(true);
    const { subject, topic, idx: stIdx } = MOCK_SET[mockIdx];
    const st  = BOARDS[currentBoard][subject][topic][stIdx];
    const aoD = st.aos.map(a => `${a}: ${AO_DESC[a] || a}`).join('; ');
    try {
      const text = await callAI(
        `You are an experienced ${currentBoard} GCSE examiner. Mark responses accurately. Return JSON only.`,
        `Board: ${currentBoard}\nSpec: ${SPEC[currentBoard][subject]}\nPaper: ${st.paper} — ${st.qRef}\nAOs: ${aoD}\nMarks: ${question.marks}\nStudent answer: """${answer}"""\nReturn ONLY valid JSON:\n{"score":N,"outOf":${question.marks},"grade":"Excellent|Good|Satisfactory|Needs Improvement","feedback":"2–3 examiner sentences","aoBreakdown":[{"ao":"AO1","comment":"brief"}],"improvements":"1–2 specific improvements","modelAnswer":"top-band model answer"}`,
        1200
      );
      setFeedback(parseJSON(text));
    } catch { /* silent */ }
    setLoadingFb(false);
  }

  async function nextQuestion() {
    const next = mockIdx + 1;
    setMockIdx(next);
    setFeedback(null);
    await loadMockQ(next);
  }

  const pct = (mockIdx / MOCK_SET.length) * 100;
  const info = question ? SUBJECT_LABELS[question._subject] : null;
  const boardColor = BOARD_COLORS[currentBoard];

  if (mockIdx >= MOCK_SET.length && started) {
    return (
      <div id="screen-mock" className="screen active">
        <div className="practice-wrap">
          <div className="center" style={{ padding: '40px 0' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <div className="section-title mt">Mock Complete!</div>
            <p style={{ color: 'var(--slate)', marginTop: 8 }}>
              All {MOCK_SET.length} {currentBoard}-style questions done.
            </p>
            <button className="btn btn-primary mt" onClick={startMock}>New Mock</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-mock" className="screen active">
      <div className="practice-wrap">
        <div className="section-title">Mock Exam</div>
        <div className="section-sub">{currentBoard} · Mixed paper.</div>
        {!started ? (
          <button className="btn btn-primary" onClick={startMock}>Start Mock →</button>
        ) : (
          <>
            <div className="mock-progress">
              <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
              <span className="progress-text">Q{mockIdx + 1} of {MOCK_SET.length}</span>
            </div>
            {loadingQ && <div className="loading"><div className="spinner" /> Generating {currentBoard}-style question…</div>}
            {!loadingQ && question && info && (
              <div className="q-area">
                <SourceBar
                  cols={[
                    { label: 'Spec',  value: SPEC[currentBoard][question._subject] },
                    { label: 'Paper', value: BOARDS[currentBoard][question._subject][question._topic][question._stIdx].paper },
                    { label: 'AOs',   value: <>{BOARDS[currentBoard][question._subject][question._topic][question._stIdx].aos.map(a => <span key={a} className="ao-pill">{a}</span>)}</> },
                  ]}
                  badge={{ label: currentBoard, color: boardColor }}
                />
                <div className="q-card">
                  <div className="q-header">
                    <span className={`q-tag ${info.color}`}>{info.label}</span>
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
                    <button className="btn btn-primary" onClick={submitAnswer} disabled={loadingFb}>Submit Answer</button>
                  </div>
                </div>
                {loadingFb && <div className="loading"><div className="spinner" /> Marking…</div>}
                {feedback && (
                  <FeedbackCard feedback={feedback} board={currentBoard} onNext={nextQuestion} nextLabel="Next Question →" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
