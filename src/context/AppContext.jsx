/**
 * @file AppContext.jsx
 * @description Global app state: board selection, screen navigation, leaderboard scores,
 *              and all editable resource data fetched from the API on mount.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchResource } from '../api/resources';

const AppContext = createContext(null);

/** Returns a stable UUID for this browser session, stored in localStorage. */
function getPlayerId() {
    let id = localStorage.getItem('gcsePlayerId');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('gcsePlayerId', id); }
    return id;
}

/**
 * @param {{ children: React.ReactNode }} props
 */
export function AppProvider({ children }) {
    // ---- Board / navigation state --------------------------------
    const [currentBoard,  setCurrentBoard]  = useState(null);
    const [pendingBoard,  setPendingBoard]  = useState(null);
    const [pickerOpen,    setPickerOpen]    = useState(true);
    const [currentScreen, setCurrentScreen] = useState('home');
    const [screenParams,  setScreenParams]  = useState({});
    const [scores, setScores] = useState(() =>
        JSON.parse(localStorage.getItem('gcseScores') || '[]')
    );

    // ---- Resource data — populated from API on mount -------------
    const [resourcesLoading, setResourcesLoading] = useState(true);
    const [questionBank,  setQuestionBank]  = useState([]);
    const [blueprint,     setBlueprint]     = useState([]);
    const [gcseWords,     setGcseWords]     = useState([]);
    const [videoChannels, setVideoChannels] = useState({ maths: [], english: [] });
    const [boardColors,   setBoardColors]   = useState({});
    const [boardsData,    setBoardsData]    = useState({});
    const [specData,      setSpecData]      = useState({});
    const [subjectLabels, setSubjectLabels] = useState({});
    const [aoDesc,        setAoDesc]        = useState({});
    const [topicBankMap,  setTopicBankMap]  = useState({});

    useEffect(() => {
        async function loadAll() {
            try {
                const [qs, bp, words, vids, boardsResp] = await Promise.all([
                    fetchResource('questions'),
                    fetchResource('blueprint'),
                    fetchResource('words'),
                    fetchResource('videos'),
                    fetchResource('boards'),
                ]);

                if (Array.isArray(qs)) {
                    setQuestionBank(qs.map(r => ({ slot: r.slot, topic: r.topic, q: r.question, a: r.answer, marks: r.marks })));
                }

                if (Array.isArray(bp)) {
                    setBlueprint(bp.map(r => ({ q: r.q_ref, topic: r.topic, style: r.style, marks: r.marks })));
                }

                if (Array.isArray(words)) {
                    setGcseWords(words.map(r => ({ word: r.word, clue: r.clue, subject: r.subject })));
                }

                if (Array.isArray(vids)) {
                    const channels = { maths: [], english: [] };
                    vids.forEach(r => {
                        const ch = { name: r.name, icon: r.icon || r.emoji, bg: r.bg, url: r.url, desc: r.description, topics: r.topics || [] };
                        if (r.subject === 'maths')   channels.maths.push(ch);
                        if (r.subject === 'english') channels.english.push(ch);
                    });
                    setVideoChannels(channels);
                }

                if (boardsResp?.boards?.length) {
                    const colors = {}, spec = {}, boards = {};
                    boardsResp.boards.forEach(b => {
                        colors[b.board_code] = b.color;
                        spec[b.board_code]   = b.data?.spec     || {};
                        boards[b.board_code] = b.data?.subjects || {};
                    });
                    setBoardColors(colors);
                    setSpecData(spec);
                    setBoardsData(boards);
                }

                if (boardsResp?.config) {
                    const { subject_labels, ao_desc, topic_bank_map } = boardsResp.config;
                    if (subject_labels) setSubjectLabels(subject_labels);
                    if (ao_desc)        setAoDesc(ao_desc);
                    if (topic_bank_map) setTopicBankMap(topic_bank_map);
                }
            } catch (err) {
                console.error('Failed to load resources from API:', err);
            } finally {
                setResourcesLoading(false);
            }
        }
        loadAll();
    }, []);

    useEffect(() => {
        if (currentBoard && boardColors[currentBoard]) {
            document.documentElement.style.setProperty('--board-color', boardColors[currentBoard]);
        }
    }, [currentBoard, boardColors]);

    const openBoardPicker = useCallback(() => setPickerOpen(true), []);
    const selectBoard     = useCallback(name => setPendingBoard(name), []);

    const confirmBoard = useCallback(() => {
        if (!pendingBoard) return;
        setCurrentBoard(pendingBoard);
        setPickerOpen(false);
    }, [pendingBoard]);

    const showScreen = useCallback((name, params = {}) => {
        if (!currentBoard && name !== 'home') { setPickerOpen(true); return; }
        setCurrentScreen(name);
        setScreenParams(params);
    }, [currentBoard]);

    const showPractice = useCallback((subject, topic) => {
        if (!currentBoard) { setPickerOpen(true); return; }
        setCurrentScreen('practice');
        setScreenParams({ subject, topic });
    }, [currentBoard]);

    const startGame = useCallback(game => {
        if (!currentBoard) { setPickerOpen(true); return; }
        setCurrentScreen(game);
        setScreenParams({});
    }, [currentBoard]);

    const initRealPaper = useCallback(() => {
        if (!currentBoard) { setPickerOpen(true); return; }
        if (currentBoard !== 'AQA') {
            alert('Real Paper Mode is based on the AQA Nov 2024 Foundation Paper 1 structure. Switch to AQA to use it!');
            setPickerOpen(true);
            return;
        }
        setCurrentScreen('realpaper');
        setScreenParams({});
    }, [currentBoard]);

    const initQBank = useCallback(() => {
        if (!currentBoard) { setPickerOpen(true); return; }
        setCurrentScreen('qbank');
        setScreenParams({});
    }, [currentBoard]);

    /**
     * Records a game score in both localStorage and MySQL.
     * @param {string} game
     * @param {number} score
     * @param {string} type
     */
    const saveScore = useCallback((game, score, type) => {
        const entry = { game, score, type, date: new Date().toLocaleDateString('en-GB') };
        setScores(prev => {
            const next = [entry, ...prev].slice(0, 50);
            localStorage.setItem('gcseScores', JSON.stringify(next));
            return next;
        });
        axios.post('/api/scores.php', { playerId: getPlayerId(), game, score, gameType: type }).catch(() => {});
    }, []);

    const clearScores = useCallback(() => {
        setScores([]);
        localStorage.removeItem('gcseScores');
        axios.delete(`/api/scores.php?playerId=${getPlayerId()}`).catch(() => {});
    }, []);

    const value = {
        currentBoard, pendingBoard, pickerOpen,
        currentScreen, screenParams, scores,
        openBoardPicker, selectBoard, confirmBoard,
        showScreen, showPractice, startGame, initRealPaper, initQBank,
        saveScore, clearScores,
        resourcesLoading,
        questionBank, blueprint, gcseWords, videoChannels,
        boardColors, boardsData, specData, subjectLabels, aoDesc, topicBankMap,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** @returns {ReturnType<typeof AppProvider>['props']['value']} */
export function useAppContext() {
    return useContext(AppContext);
}
