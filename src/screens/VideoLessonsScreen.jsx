/**
 * @file VideoLessonsScreen.jsx
 * @description Curated YouTube channel listings with topic chips.
 */
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function VideoLessonsScreen() {
  const { videoChannels } = useAppContext();
  const [tab, setTab] = useState('maths');
  const channels = videoChannels[tab] || [];

  return (
    <div id="screen-videos" className="screen active">
      <div style={{ maxWidth: 860 }}>
        <div className="section-title"><i className="fa-solid fa-clapperboard" /> Video Lessons</div>
        <div className="section-sub">The best free GCSE YouTube teachers — handpicked. Click a topic to jump straight to videos on it.</div>
        <div className="video-tabs">
          <button type="button" className={`vtab${tab === 'maths' ? ' active' : ''}`} onClick={() => setTab('maths')}><i className="fa-solid fa-divide" /> Maths</button>
          <button type="button" className={`vtab${tab === 'english' ? ' active' : ''}`} onClick={() => setTab('english')}><i className="fa-solid fa-book-open" /> English Lang &amp; Lit</button>
        </div>
        <div className="video-note"><i className="fa-solid fa-lightbulb" /> Tip: click any topic chip to search that channel's videos on YouTube — or visit the channel for everything.</div>
        {channels.map(ch => (
          <div key={ch.name} className="channel-card">
            <div className="channel-head">
              <div className="channel-avatar" style={{ background: ch.bg }}>
                {ch.icon?.startsWith('fa-') ? <i className={`fa-solid ${ch.icon}`} /> : ch.icon}
              </div>
              <div className="channel-info">
                <h3>{ch.name}</h3>
                <div className="channel-desc" dangerouslySetInnerHTML={{ __html: ch.desc || '' }} />
              </div>
              <a className="channel-link" href={ch.url} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-play" /> Visit channel</a>
            </div>
            <div className="topic-chips">
              {ch.topics.map(t => (
                <a
                  key={t}
                  className="topic-chip"
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ch.name + ' GCSE ' + t)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
