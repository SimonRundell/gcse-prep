/**
 * @file FeedbackCard.jsx
 * @description Displays AI marking feedback: score circle, grade, AO breakdown, model answer.
 */

/**
 * @param {{ feedback: object, board: string, onNext: Function, nextLabel?: string }} props
 */
export default function FeedbackCard({ feedback: fb, board, onNext, nextLabel = 'Next Question' }) {
  const pct = fb.score / fb.outOf;
  const sc  = pct >= 0.75 ? 's-high' : pct >= 0.5 ? 's-mid' : 's-low';
  const em  = pct >= 0.75 ? '✅' : pct >= 0.5 ? '🟡' : '❌';

  return (
    <div className="fb-card">
      <div className="fb-score-row">
        <div className={`score-circle ${sc}`}>{fb.score}/{fb.outOf}</div>
        <div>
          <div className="fb-label">{em} {fb.grade}</div>
          <div style={{ fontSize: '.73rem', color: 'var(--slate)' }}>{board} mark scheme</div>
        </div>
      </div>
      <div className="fb-body">
        <p>{fb.feedback}</p>
        {fb.aoBreakdown?.length > 0 && (
          <>
            <h4>AO Breakdown</h4>
            <div className="ao-breakdown">
              {fb.aoBreakdown.map((a, i) => (
                <div key={i} className="ao-item"><span>{a.ao}</span> {a.comment}</div>
              ))}
            </div>
          </>
        )}
        <h4>To improve</h4>
        <p>{fb.improvements}</p>
        <h4>Model answer</h4>
        <div className="model-ans"
          dangerouslySetInnerHTML={{ __html: (fb.modelAnswer || '').replace(/\n/g, '<br>') }}
        />
      </div>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={onNext}>{nextLabel}</button>
      </div>
    </div>
  );
}
