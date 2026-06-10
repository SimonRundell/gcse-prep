/**
 * @file App.jsx
 * @description Root component. Renders the shell (Header, Sidebar, modal) and routes
 *              to the active screen via a switch statement. Only the active screen is
 *              mounted, so each screen resets naturally on navigation.
 */
import { AppProvider, useAppContext } from './context/AppContext';
import Header            from './components/Header';
import Sidebar           from './components/Sidebar';
import BoardPickerModal  from './components/BoardPickerModal';
import HomeScreen        from './screens/HomeScreen';
import PracticeScreen    from './screens/PracticeScreen';
import MockScreen        from './screens/MockScreen';
import RealPaperScreen   from './screens/RealPaperScreen';
import QuestionBankScreen from './screens/QuestionBankScreen';
import VideoLessonsScreen from './screens/VideoLessonsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import GamesHub          from './games/GamesHub';
import FlashcardGame     from './games/FlashcardGame';
import SpeedRoundGame    from './games/SpeedRoundGame';
import BeatTheExaminerGame from './games/BeatTheExaminerGame';
import WordScrambleGame  from './games/WordScrambleGame';
import MatchUpGame       from './games/MatchUpGame';

/** Inner component so it can use context. */
function AppShell() {
  const { currentScreen, screenParams } = useAppContext();

  function renderScreen() {
    switch (currentScreen) {
      case 'home':         return <HomeScreen />;
      case 'practice':     return <PracticeScreen key={`${screenParams?.subject}-${screenParams?.topic}`} />;
      case 'mock':         return <MockScreen />;
      case 'real-paper':   return <RealPaperScreen />;
      case 'qbank':        return <QuestionBankScreen />;
      case 'videos':       return <VideoLessonsScreen />;
      case 'leaderboard':  return <LeaderboardScreen />;
      case 'games':        return <GamesHub />;
      case 'flashcard':    return <FlashcardGame />;
      case 'speed':        return <SpeedRoundGame />;
      case 'gte':          return <BeatTheExaminerGame />;
      case 'scramble':     return <WordScrambleGame />;
      case 'match':        return <MatchUpGame />;
      default:             return <HomeScreen />;
    }
  }

  return (
    <div id="app-root">
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          {renderScreen()}
        </main>
      </div>
      <BoardPickerModal />
    </div>
  );
}

/** @returns {JSX.Element} */
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
