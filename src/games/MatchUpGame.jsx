/**
 * @file MatchUpGame.jsx
 * @description Connect terms to definitions. Instant bank mode or AI-generated pairs.
 */
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { callAI, parseJSON } from '../api/ai';

export default function MatchUpGame() {
  const { currentBoard, saveScore, questionBank } = useAppContext();
  const [pairs,    setPairs]    = useState([]);
  const [terms,    setTerms]    = useState([]);  // shuffled
  const [defs,     setDefs]     = useState([]);  // shuffled
  const [selected, setSelected] = useState(null);  // { type: 'term'|'def', val: string }
  const [matched,  setMatched]  = useState(new Set());
  const [errors,   setErrors]   = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    const shortQs = questionBank.filter(q => q.marks === 1 && q.a.length < 30);
    if (shortQs.length >= 6 && Math.random() < 0.7) {
      const p = shortQs.sort(() => Math.random() - 0.5).slice(0, 6).map(q => ({ term: q.q, definition: q.a }));
      buildBoard(p);
      return;
    }
    setLoading(true);
    try {
      const text = await callAI(
        'You are a GCSE revision expert. Generate matching pairs. Return ONLY valid JSON array, no markdown.',
        `Board: ${currentBoard}. Generate 6 matching pairs for GCSE revision (mix of maths and English).\nReturn ONLY: [{"term":"key term or concept","definition":"its definition or description"}]`,
        600
      );
      buildBoard(parseJSON(text).slice(0, 6));
    } catch {
      const p = questionBank.filter(q => q.marks === 1 && q.a.length < 30).sort(() => Math.random() - 0.5).slice(0, 6).map(q => ({ term: q.q, definition: q.a }));
      buildBoard(p);
    }
    setLoading(false);
  }

  function buildBoard(p) {
    setPairs(p);
    setTerms([...p].sort(() => Math.random() - 0.5));
    setDefs([...p].sort(() => Math.random() - 0.5));
    setSelected(null);
    setMatched(new Set());
    setErrors(0);
    setDone(false);
  }

  function select(type, val) {
    if (matched.has(val)) return;
    if (!selected) {
      setSelected({ type, val });
      return;
    }
    if (selected.type === type) {
      setSelected({ type, val });
      return;
    }
    const termVal = selected.type === 'term' ? selected.val : val;
    const defVal  = selected.type === 'def'  ? selected.val : val;
    const termPair = pairs.find(p => p.term === termVal);
    if (termPair && termPair.definition === defVal) {
      const next = new Set(matched).add(termVal);
      setMatched(next);
      setSelected(null);
      if (next.size === pairs.length) {
        saveScore('Match-Up', Math.max(0, pairs.length * 10 - errors * 5), 'match');
        setTimeout(() => setDone(true), 400);
      }
    } else {
      setErrors(e => e + 1);
      setSelected(null);
    }
  }

  function itemClass(type, val) {
    if (matched.has(type === 'def' ? pairs.find(p=>p.definition===val)?.term ?? val : val)) return 'match-item matched';
    if (selected?.type === type && selected?.val === val) return 'match-item selected';
    return 'match-item';
  }

  if (loading) {
    return (
      <div id="screen-match" className="screen active">
        <div className="game-wrap">
          <div className="game-header"><div className="game-title"><i className="fa-solid fa-puzzle-piece" /> Match-Up</div></div>
          <div className="loading"><div className="spinner" /> Generating match-up…</div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div id="screen-match" className="screen active">
        <div className="game-wrap center" style={{ paddingTop: 32 }}>
          <div style={{ fontSize: '3rem' }}><i className="fa-solid fa-puzzle-piece" /></div>
          <div className="section-title mt">All matched!</div>
          <p style={{ color: 'var(--slate)', margin: '10px 0' }}>Errors: {errors}</p>
          <button className="btn btn-primary mt" onClick={init}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-match" className="screen active">
      <div className="game-wrap">
        <div className="game-header">
          <div className="game-title"><i className="fa-solid fa-puzzle-piece" /> Match-Up</div>
          <div className="game-stats">
            <div className="stat-box">Matched <span className="stat-val stat-teal">{matched.size}</span></div>
            <div className="stat-box">Errors  <span className="stat-val stat-coral">{errors}</span></div>
          </div>
        </div>
        <div className="match-area">
          <div className="match-col">
            <h4>Terms</h4>
            {terms.map((p, i) => (
              <div key={i} className={itemClass('term', p.term)} onClick={() => select('term', p.term)}>
                {p.term}
              </div>
            ))}
          </div>
          <div className="match-col">
            <h4>Definitions</h4>
            {defs.map((p, i) => {
              const ownerTerm = pairs.find(pr => pr.definition === p.definition)?.term ?? p.definition;
              const cls = matched.has(ownerTerm)
                ? 'match-item matched'
                : selected?.type === 'def' && selected?.val === p.definition
                ? 'match-item selected' : 'match-item';
              return (
                <div key={i} className={cls} onClick={() => select('def', p.definition)}>
                  {p.definition}
                </div>
              );
            })}
          </div>
        </div>
        <p style={{ fontSize: '.78rem', color: 'var(--slate)', textAlign: 'center' }}>
          Click a term, then its matching definition.
        </p>
      </div>
    </div>
  );
}
