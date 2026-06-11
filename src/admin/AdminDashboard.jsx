/**
 * @file AdminDashboard.jsx
 * @description Tabbed admin dashboard for managing all editable resources.
 */
import { useState } from 'react';
import { adminLogout } from '../api/resources';
import QuestionsTab  from './tabs/QuestionsTab';
import WordsTab       from './tabs/WordsTab';
import VideosTab      from './tabs/VideosTab';
import BlueprintTab   from './tabs/BlueprintTab';
import BoardsTab      from './tabs/BoardsTab';
import AdminUsersTab  from './tabs/AdminUsersTab';

const TABS = [
    { id: 'questions',   icon: 'layer-group',   label: 'Questions'   },
    { id: 'words',       icon: 'font',           label: 'Words'       },
    { id: 'videos',      icon: 'video',          label: 'Videos'      },
    { id: 'blueprint',   icon: 'file-lines',     label: 'Blueprint'   },
    { id: 'boards',      icon: 'school',         label: 'Boards'      },
    { id: 'adminusers',  icon: 'user-shield',    label: 'Admin Users' },
];

/** @param {{ onLogout: () => void, onBack: () => void }} props */
export default function AdminDashboard({ onLogout, onBack }) {
    const [active, setActive] = useState('questions');

    async function logout() {
        await adminLogout().catch(() => {});
        onLogout();
    }

    function renderTab() {
        switch (active) {
            case 'questions': return <QuestionsTab />;
            case 'words':     return <WordsTab />;
            case 'videos':    return <VideosTab />;
            case 'blueprint': return <BlueprintTab />;
            case 'boards':      return <BoardsTab />;
            case 'adminusers':  return <AdminUsersTab />;
            default:            return null;
        }
    }

    return (
        <div className="admin-shell">
            <div className="admin-header">
                <div className="admin-logo">GCSE<span>Prep</span></div>
                <span style={{ color: 'var(--slate)', fontSize: '.82rem', marginRight: 'auto' }}>Admin Panel</span>
                <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '.8rem', color: 'var(--slate)', marginRight: 12, cursor: 'pointer', padding: 0 }}><i className="fa-solid fa-arrow-left" /> App</button>
                <button onClick={logout} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--slate)', padding: '4px 12px', cursor: 'pointer', fontSize: '.8rem' }}>
                    Sign out
                </button>
            </div>
            <div className="admin-main">
                <div className="admin-tabs">
                    {TABS.map(t => (
                        <button key={t.id} className={`admin-tab${active === t.id ? ' active' : ''}`} onClick={() => setActive(t.id)}>
                            <i className={`fa-solid fa-${t.icon}`} /> {t.label}
                        </button>
                    ))}
                </div>
                {renderTab()}
            </div>
        </div>
    );
}
