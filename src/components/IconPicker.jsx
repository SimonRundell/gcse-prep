/**
 * @file IconPicker.jsx
 * @description Dropdown picker for Font Awesome solid icons (curated free set).
 *              Shows the current icon on a toggle button; clicking opens a grid
 *              of icons to choose from. Legacy non-FA values (old emoji) are
 *              shown as plain text until replaced.
 */
import { useState } from 'react';

/** Curated Font Awesome 6 free solid icons, relevant to GCSE subjects and channels. */
const ICONS = [
  'fa-calculator', 'fa-divide', 'fa-square-root-variable', 'fa-ruler-combined', 'fa-shapes',
  'fa-chart-bar', 'fa-hashtag', 'fa-dice', 'fa-compass-drafting', 'fa-infinity',
  'fa-book', 'fa-book-open', 'fa-feather', 'fa-pen-nib', 'fa-pencil',
  'fa-masks-theater', 'fa-quote-left', 'fa-language', 'fa-scroll', 'fa-spell-check',
  'fa-graduation-cap', 'fa-chalkboard-user', 'fa-school', 'fa-clipboard-list', 'fa-file-lines',
  'fa-brain', 'fa-lightbulb', 'fa-wand-magic-sparkles', 'fa-hat-wizard', 'fa-flask',
  'fa-atom', 'fa-dna', 'fa-microscope', 'fa-globe', 'fa-earth-europe',
  'fa-landmark', 'fa-clock', 'fa-music', 'fa-palette', 'fa-video',
  'fa-tv', 'fa-clapperboard', 'fa-play', 'fa-star', 'fa-trophy',
  'fa-bolt', 'fa-fire', 'fa-heart', 'fa-puzzle-piece', 'fa-gamepad',
  'fa-cat', 'fa-dog', 'fa-mug-hot', 'fa-spa', 'fa-seedling',
];

/**
 * @param {{ value?: string, onChange: Function }} props
 *        value    - current Font Awesome class (e.g. 'fa-cat'), or legacy text
 *        onChange - called with the chosen Font Awesome class
 */
export default function IconPicker({ value = '', onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="icon-picker">
      <button type="button" className="icon-picker-toggle" onClick={() => setOpen(o => !o)}>
        <span className="icon-picker-current">
          {value ? (value.startsWith('fa-') ? <i className={`fa-solid ${value}`} /> : value) : <i className="fa-solid fa-icons" />}
        </span>
        <span className="icon-picker-label">{value || 'Choose an icon…'}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`} />
      </button>
      {open && (
        <div className="icon-picker-grid">
          {ICONS.map(ic => (
            <button
              key={ic}
              type="button"
              title={ic}
              className={ic === value ? 'active' : ''}
              onClick={() => { onChange(ic); setOpen(false); }}
            >
              <i className={`fa-solid ${ic}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
