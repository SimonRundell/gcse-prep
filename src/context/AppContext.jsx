/**
 * @file AppContext.jsx
 * @description Global app state: board selection, screen navigation, and leaderboard scores.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BOARD_COLORS } from '../data/boards';

const AppContext = createContext(null);

/** Returns a stable UUID for this browser session, stored in localStorage. */
function getPlayerId() {
  let id = localStorage.getItem('gcsePlayerId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('gcsePlayerId', id);
  }
  return id;
}

/**
 * @param {{ children: React.ReactNode }} props
 */
export function AppProvider({ children }) {
  const [currentBoard,  setCurrentBoard]  = useState(null);
  const [pendingBoard,  setPendingBoard]  = useState(null);
  const [pickerOpen,    setPickerOpen]    = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams,  setScreenParams]  = useState({});
  const [scores, setScores] = useState(() =>
    JSON.parse(localStorage.getItem('gcseScores') || '[]')
  );

  // Apply board colour CSS variable whenever the board changes.
  useEffect(() => {
    if (currentBoard) {
      document.documentElement.style.setProperty('--board-color', BOARD_COLORS[currentBoard]);
    }
  }, [currentBoard]);

  const openBoardPicker = useCallback(() => setPickerOpen(true), []);

  const selectBoard = useCallback((name) => setPendingBoard(name), []);

  const confirmBoard = useCallback(() => {
    if (!pendingBoard) return;
    setCurrentBoard(pendingBoard);
    setPickerOpen(false);
  }, [pendingBoard]);

  /** Navigate to a named screen, opening the board picker first if no board is set. */
  const showScreen = useCallback((name, params = {}) => {
    if (!currentBoard && name !== 'home') {
      setPickerOpen(true);
      return;
    }
    setCurrentScreen(name);
    setScreenParams(params);
  }, [currentBoard]);

  const showPractice = useCallback((subject, topic) => {
    if (!currentBoard) { setPickerOpen(true); return; }
    setCurrentScreen('practice');
    setScreenParams({ subject, topic });
  }, [currentBoard]);

  const startGame = useCallback((game) => {
    if (!currentBoard) { setPickerOpen(true); return; }
    setCurrentScreen(game);
    setScreenParams({});
  }, [currentBoard]);

  const initRealPaper = useCallback(() => {
    if (!currentBoard) { setPickerOpen(true); return; }
    if (currentBoard !== 'AQA') {
      alert('Real Paper Mode is currently based on the AQA Nov 2024 Foundation Paper 1 structure. Switch to AQA to use it!');
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
   * @param {string} game - Display name of the game
   * @param {number} score
   * @param {string} type - Short game identifier for grouping personal bests
   */
  const saveScore = useCallback((game, score, type) => {
    const entry = { game, score, type, date: new Date().toLocaleDateString('en-GB') };
    setScores(prev => {
      const next = [entry, ...prev].slice(0, 50);
      localStorage.setItem('gcseScores', JSON.stringify(next));
      return next;
    });
    axios.post('/api/scores.php', {
      playerId: getPlayerId(), game, score, gameType: type,
    }).catch(() => {});
  }, []);

  const clearScores = useCallback(() => {
    setScores([]);
    localStorage.removeItem('gcseScores');
    axios.delete(`/api/scores.php?playerId=${getPlayerId()}`).catch(() => {});
  }, []);

  const value = {
    currentBoard, pendingBoard, pickerOpen,
    currentScreen, screenParams,
    scores,
    openBoardPicker, selectBoard, confirmBoard,
    showScreen, showPractice, startGame, initRealPaper, initQBank,
    saveScore, clearScores,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** @returns {ReturnType<typeof AppProvider>['props']['value']} */
export function useAppContext() {
  return useContext(AppContext);
}
