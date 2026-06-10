/**
 * @file RealPaperScreen.jsx
 * @description Real Paper Mode: AQA Nov 2024 Foundation Paper 1 structure, question by question.
 */
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { callAI, parseJSON } from '../api/ai';
import SourceBar from '../components/SourceBar';

function qHtml(t) { return (t||'').replace(/\\n/g,'\n').split('\n').map(l=>`<p style="margin-bottom:5px">${l}</p>`).join(''); }

export default function RealPaperScreen() {
  const { currentBoard, blueprint } = useAppContext();
  const [rpIdx,     setRpIdx]     = useState(0);
  const [started,   setStarted]   = useState(false);
  const [question,  setQuestion]  = useState(null);
  const [qText,     setQText]     = useState('');
  const [answer,    setAnswer]    = useState('');
  const [feedback,  setFeedback]  = useState(null);
  const [loadingQ,  setLoadingQ]  = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);

  async function loadQ(idx) {
    if (idx >= blueprint.length) { setQuestion(null); return; }
    setQuestion(null); setFeedback(null); setAnswer('');
    setLoadingQ(true);
    const bp = blueprint[idx];
    try {
      const text = await callAI(
        `You are an AQA GCSE Maths examiner. Generate a Foundation tier non-calculator question in the EXACT style described. Return ONLY valid JSON: {"question":"text with \\n breaks","marks":${bp.marks},"tier":"Foundation","hint":"one-line method hint"}`,
        `AQA 8300 Paper 1 Foundation (non-calculator), question slot ${bp.q}.\nTopic: ${bp.topic}\nStyle to follow: ${bp.style}\nMarks: ${bp.marks}\nGenerate a FRESH question in this exact style with different numbers/context. Do not include answers.`,
        800
      );
      const q = parseJSON(text);
      setQuestion(q);
      setQText(q.question);
    } catch { setQuestion(null); }
    setLoadingQ(false);
  }

  async function submitAnswer() {
    if (!answer.trim()) { alert('Show your working first!'); return; }
    setLoadingFb(true);
    const bp = blueprint[rpIdx];
    try {
      const text = await callAI(
        'You are an AQA GCSE Maths examiner. Mark accurately with method marks. Return JSON only.',
        `Question: ${qText.replace(/\\n/g,'\n')}\nMarks available: ${bp.marks}\nStudent answer: """${answer}"""\nReturn ONLY: {"score":N,"outOf":${bp.marks},"grade":"Excellent|Good|Satisfactory|Needs Improvement","feedback":"2 examiner sentences incl. method marks","modelAnswer":"worked solution"}`,
        800
      );
      setFeedback(parseJSON(text));
    } catch { /* silent */ }
    setLoadingFb(false);
  }

  function nextQ() {
    const next = rpIdx + 1;
    setRpIdx(next);
    setFeedback(null);
    loadQ(next);
  }

  function startPaper() {
    setStarted(true);
    setRpIdx(0);
    loadQ(0);
  }

  if (rpIdx >= blueprint.length && started) {
    return (
      <div id="screen-realpaper" className="screen active">
        <div className="practice-wrap">
          <div className="center" style={{ padding: '40px 0' }}>
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <div className="section-title mt">Full paper complete!</div>
            <p style={{ color: 'var(--slate)', margin: '10px 0' }}>
              You worked through all {blueprint.length} question slots of the Nov 2024 1F structure.
            </p>
            <button className="btn btn-primary mt" onClick={startPaper}>Run It Again</button>
          </div>
        </div>
      </div>
    );
  }

  const bp = blueprint[rpIdx] || {};
  const pct = (rpIdx / blueprint.length) * 100;

  return (
    <div id="screen-realpaper" className="screen active">
      <div className="practice-wrap">
        <div className="section-title">📄 Real Paper Mode</div>
        <div className="section-sub">Practise the structure of a real AQA paper — Nov 2024 Foundation Paper 1, question by question.</div>
        <div className="video-note">
          📋 This mode follows the exact structure of the real <strong>AQA Nov 2024 Paper 1F (Non-Calculator)</strong> — same topics, same question order, same mark allocations. Each question is freshly generated in the style of that slot, so you can practise again and again.
        </div>
        {!started ? (
          <button className="btn btn-primary" onClick={startPaper}>Start Paper →</button>
        ) : (
          <>
            <div className="mock-progress">
              <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
              <span className="progress-text">{bp.q} of Q{AQA_1F_BLUEPRINT.length} · {bp.marks} mark{bp.marks>1?'s':''} · {bp.topic}</span>
            </div>
            {loadingQ && <div className="loading"><div className="spinner" /> Generating {bp.q}-style question…</div>}
            {!loadingQ && question && (
              <div className="q-area">
                <SourceBar
                  cols={[
                    { label: 'Based on', value: 'AQA Nov 2024 · Paper 1F' },
                    { label: 'Slot',     value: bp.q },
                    { label: 'Topic',    value: bp.topic, small: true },
                  ]}
                  badge={{ label: 'AQA-style', color: '#e63946' }}
                />
                <div className="q-card">
                  <div className="q-header">
                    <span className="q-tag tag-maths">Mathematics</span>
                    <span className="q-marks">[{bp.marks} marks] · Foundation · Non-calc</span>
                  </div>
                  <div className="q-text" dangerouslySetInnerHTML={{ __html: qHtml(question.question) }} />
                  <div className="hint-bar">💡 <span>{question.hint}</span></div>
                  <textarea
                    className="ans-box"
                    placeholder="Show your working…"
                    style={{ minHeight: 110 }}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                  <div className="btn-row" style={{ marginTop: 10 }}>
                    <button className="btn btn-primary" onClick={submitAnswer} disabled={loadingFb}>Submit</button>
                    <button className="btn btn-ghost" onClick={nextQ}>Skip →</button>
                  </div>
                </div>
                {loadingFb && <div className="loading"><div className="spinner" /> Marking…</div>}
                {feedback && (
                  <div className="fb-card">
                    <div className="fb-score-row">
                      <div className={`score-circle ${feedback.score/feedback.outOf>=.75?'s-high':feedback.score/feedback.outOf>=.5?'s-mid':'s-low'}`}>
                        {feedback.score}/{feedback.outOf}
                      </div>
                      <div><div className="fb-label">{feedback.grade}</div></div>
                    </div>
                    <div className="fb-body">
                      <p>{feedback.feedback}</p>
                      <h4>Worked solution</h4>
                      <div className="model-ans" dangerouslySetInnerHTML={{ __html: (feedback.modelAnswer||'').replace(/\n/g,'<br>') }} />
                    </div>
                    <div className="btn-row" style={{ marginTop: 14 }}>
                      <button className="btn btn-primary" onClick={nextQ}>Next Question →</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
