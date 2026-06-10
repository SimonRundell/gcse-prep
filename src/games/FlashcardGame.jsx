/**
 * @file FlashcardGame.jsx
 * @description Flip-card revision game: instant maths bank deck or AI-generated subject decks.
 */
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SUBJECT_LABELS } from '../data/boards';
import { QUESTION_BANK } from '../data/questionBank';
import { callAI, parseJSON } from '../api/ai';

export default function FlashcardGame() {
  const { currentBoard, saveScore } = useAppContext();
  const [phase,    setPhase]    = useState('pick');   // 'pick' | 'playing' | 'done'
  const [cards,    setCards]    = useState([]);
  const [cardIdx,  setCardIdx]  = useState(0);
  const [got,      setGot]      = useState(0);
  const [miss,     setMiss]     = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [deckLabel,setDeckLabel]= useState('');

  function loadBankDeck() {
    const deck = QUESTION_BANK
      .filter(q => q.a.length < 60)
      .sort(() => Math.random() - 0.5)
      .slice(0, 12)
      .map(q => ({ front: q.q, back: q.a, category: q.topic }));
    setCards(deck);
    setDeckLabel(`${currentBoard || 'AQA'} · Maths — instant bank deck`);
    setCardIdx(0); setGot(0); setMiss(0); setFlipped(false);
    setPhase('playing');
  }

  async function loadAIDeck(subject) {
    setLoading(true);
    setDeckLabel(`${currentBoard} · ${SUBJECT_LABELS[subject].label}`);
    try {
      const text = await callAI(
        'You are a GCSE revision expert. Generate flashcards. Return ONLY valid JSON array, no markdown.',
        `Board: ${currentBoard}\nSubject: ${SUBJECT_LABELS[subject].label}\nGenerate 10 flashcards for GCSE ${SUBJECT_LABELS[subject].label}.\nReturn ONLY a JSON array:\n[{"front":"term or question","back":"definition or answer","category":"topic name"}]`,
        1000
      );
      const deck = parseJSON(text);
      setCards(deck);
      setCardIdx(0); setGot(0); setMiss(0); setFlipped(false);
      setPhase('playing');
    } catch {
      alert('Error generating flashcards. Please try again.');
    }
    setLoading(false);
  }

  function flip() { if (!flipped) setFlipped(true); }

  function result(didGetIt) {
    if (didGetIt) setGot(g => g + 1); else setMiss(m => m + 1);
    const next = cardIdx + 1;
    if (next >= cards.length) {
      saveScore('Flashcards', didGetIt ? got + 1 : got, 'flashcard');
      setPhase('done');
    } else {
      setCardIdx(next);
      setFlipped(false);
    }
  }

  function restart() { setCardIdx(0); setGot(0); setMiss(0); setFlipped(false); setPhase('playing'); }

  if (phase === 'done') {
    return (
      <div id="screen-flashcard" className="screen active">
        <div className="game-wrap center" style={{ paddingTop: 32 }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <div className="section-title mt">Deck complete!</div>
          <p style={{ color: 'var(--slate)', margin: '10px 0' }}>
            Got: <strong style={{ color: 'var(--teal)' }}>{got}</strong> · Missed: <strong style={{ color: 'var(--coral)' }}>{miss}</strong>
          </p>
          <button className="btn btn-primary mt" onClick={restart}>Restart</button>{' '}
          <button className="btn btn-ghost" onClick={() => setPhase('pick')}>New subject</button>
        </div>
      </div>
    );
  }

  if (phase === 'playing' && cards.length) {
    const card = cards[cardIdx];
    return (
      <div id="screen-flashcard" className="screen active">
        <div className="game-wrap">
          <div className="game-header">
            <div>
              <div className="game-title">🃏 Flashcards</div>
              <div style={{ fontSize: '.78rem', color: 'var(--slate)' }}>{deckLabel}</div>
            </div>
            <div className="game-stats">
              <div className="stat-box"><span className="stat-teal">✓</span><span className="stat-val stat-teal">{got}</span></div>
              <div className="stat-box"><span className="stat-coral">✗</span><span className="stat-val stat-coral">{miss}</span></div>
            </div>
          </div>
          <div className="flashcard-scene" onClick={flip}>
            <div className={`flashcard${flipped ? ' flipped' : ''}`}>
              <div className="card-face card-front">
                <span className="face-label">📚 {card.category || 'Topic'}</span>
                <div className="face-content">{card.front}</div>
                <div className="face-sub">Tap to reveal</div>
              </div>
              <div className="card-face card-back">
                <span className="face-label">✅ Answer</span>
                <div className="face-content">{card.back}</div>
              </div>
            </div>
          </div>
          <p className="card-tap-hint">Tap card to flip · <span style={{ color: 'var(--slate)' }}>{cardIdx + 1} / {cards.length}</span></p>
          {flipped && (
            <div className="card-result-btns">
              <button className="btn-got-it" onClick={() => result(true)}>✓ Got it</button>
              <button className="btn-missed" onClick={() => result(false)}>✗ Missed</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="screen-flashcard" className="screen active">
      <div className="game-wrap">
        <div className="game-header">
          <div className="game-title">🃏 Flashcards</div>
        </div>
        <div className="section-sub">Pick a subject for your flashcards:</div>
        {loading
          ? <div className="loading"><div className="spinner" /> Generating flashcards…</div>
          : (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={loadBankDeck}>⚡ Instant Maths Deck (bank)</button>
              <button className="btn btn-ghost"   onClick={() => loadAIDeck('maths')}>➗ Maths (AI)</button>
              <button className="btn btn-ghost"   onClick={() => loadAIDeck('language')}>📖 English Language</button>
              <button className="btn btn-ghost"   onClick={() => loadAIDeck('literature')}>🎭 English Literature</button>
            </div>
          )
        }
      </div>
    </div>
  );
}
