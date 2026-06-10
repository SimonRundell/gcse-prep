/**
 * @file AppContext.jsx
 * @description Global app state: board selection, screen navigation, leaderboard scores,
 *              and all editable resource data (fetched from API, falls back to static files).
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchResource } from '../api/resources';

// Static fallbacks — used until the API responds (or if API is unavailable)
import { BOARD_COLORS as S_COLORS, SPEC as S_SPEC, SUBJECT_LABELS as S_SL, AO_DESC as S_AO, TOPIC_BANK_MAP as S_TBM, BOARDS as S_BOARDS } from '../data/boards';
import { QUESTION_BANK as S_QS }   from '../data/questionBank';
import { AQA_1F_BLUEPRINT as S_BP } from '../data/blueprint';
import { GCSE_WORDS as S_WORDS }    from '../data/words';
import { VIDEO_CHANNELS as S_VID }  from '../data/videos';

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

    // ---- Live resource data (falls back to static imports) -------
    const [questionBank,  setQuestionBank]  = useState(S_QS);
    const [blueprint,     setBlueprint]     = useState(S_BP);
    const [gcseWords,     setGcseWords]     = useState(S_WORDS);
    const [videoChannels, setVideoChannels] = useState(S_VID);
    const [boardColors,   setBoardColors]   = useState(S_COLORS);
    const [boardsData,    setBoardsData]    = useState(S_BOARDS);
    const [specData,      setSpecData]      = useState(S_SPEC);
    const [subjectLabels, setSubjectLabels] = useState(S_SL);
    const [aoDesc,        setAoDesc]        = useState(S_AO);
    const [topicBankMap,  setTopicBankMap]  = useState(S_TBM);

    // Fetch all live resource data on mount
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

                // Questions
                if (Array.isArray(qs) && qs.length) {
                    setQuestionBank(qs.map(r => ({ slot: r.slot, topic: r.topic, q: r.question, a: r.answer, marks: r.marks })));
                }

                // Blueprint
                if (Array.isArray(bp) && bp.length) {
                    setBlueprint(bp.map(r => ({ q: r.q_ref, topic: r.topic, style: r.style, marks: r.marks })));
                }

                // Words
                if (Array.isArray(words) && words.length) {
                    setGcseWords(words.map(r => ({ word: r.word, clue: r.clue, subject: r.subject })));
                }

                // Videos — rebuild VIDEO_CHANNELS shape { maths: [...], english: [...] }
                if (Array.isArray(vids) && vids.length) {
                    const channels = { maths: [], english: [] };
                    vids.forEach(r => {
                        const ch = { name: r.name, emoji: r.emoji, bg: r.bg, url: r.url, desc: r.description, topics: r.topics || [] };
                        if (r.subject === 'maths')   channels.maths.push(ch);
                        if (r.subject === 'english')  channels.english.push(ch);
                    });
                    setVideoChannels(channels);
                }

                // Boards — rebuild BOARD_COLORS, SPEC, BOARDS, plus config fields
                if (boardsResp && Array.isArray(boardsResp.boards) && boardsResp.boards.length) {
                    const colors = {}, spec = {}, boards = {};
                    boardsResp.boards.forEach(b => {
                        colors[b.board_code] = b.color;
                        spec[b.board_code]   = b.data?.spec   || {};
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
            } catch {
                // Silently keep static fallback data
            }
        }
        loadAll();
    }, []);

    // Apply board colour CSS variable whenever the board or live colors change
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
        // Live resource data
        questionBank, blueprint, gcseWords, videoChannels,
        boardColors, boardsData, specData, subjectLabels, aoDesc, topicBankMap,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** @returns {ReturnType<typeof AppProvider>['props']['value']} */
export function useAppContext() {
    return useContext(AppContext);
}
