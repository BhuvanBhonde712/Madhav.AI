import ChakraLoader from './components/ChakraLoader';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import LoginPage           from './pages/LoginPage';
import ChatPage            from './pages/ChatPage';
import QuizPage            from './pages/QuizPage';
import DailyVersePage      from './pages/DailyVersePage';
import VoiceChatPage       from './pages/VoiceChatPage';
import KarmaCalculatorPage from './pages/KarmaCalculatorPage';
import StoryModePage       from './pages/StoryModePage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen w-screen bg-[#0D0D0D] flex items-center justify-center">
      <ChakraLoader size="xl" text="Loading Madhav…" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// Sidebar only on authenticated pages, never on /login
function ConditionalSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || location.pathname === '/login') return null;
  return <Sidebar />;
}

// Keyboard shortcuts — must be inside BrowserRouter
function KeyboardNav() {
  const navigate = useNavigate();
  useEffect(() => {
    const map = { c: '/', q: '/quiz', d: '/daily-verse', v: '/voice', k: '/karma', s: '/story' };
    const handler = (e) => {
      if (e.altKey && map[e.key]) { e.preventDefault(); navigate(map[e.key]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <KeyboardNav />
          <ConditionalSidebar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/"            element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            <Route path="/quiz"        element={<PrivateRoute><QuizPage /></PrivateRoute>} />
            <Route path="/daily-verse" element={<PrivateRoute><DailyVersePage /></PrivateRoute>} />
            <Route path="/voice"       element={<PrivateRoute><VoiceChatPage /></PrivateRoute>} />
            <Route path="/karma"       element={<PrivateRoute><KarmaCalculatorPage /></PrivateRoute>} />
            <Route path="/story"       element={<PrivateRoute><StoryModePage /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
}
