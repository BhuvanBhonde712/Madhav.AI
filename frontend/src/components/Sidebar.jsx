import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { getChatHistory } from '../utils/chatApi';
import {
  ChatIcon, QuizIcon, VerseIcon,
  VoiceIcon, KarmaIcon, StoryIcon,
  EditIcon, LogoutIcon
} from './Icons';

const NAV = [
  { path: '/',            Icon: ChatIcon,  label: 'Chat with Madhav',   shortcut: 'Alt+C' },
  { path: '/quiz',        Icon: QuizIcon,  label: 'Find Your Character', shortcut: 'Alt+Q' },
  { path: '/daily-verse', Icon: VerseIcon, label: 'Daily Dharma Verse',  shortcut: 'Alt+D' },
  { path: '/voice',       Icon: VoiceIcon, label: 'Voice with Krishna',  shortcut: 'Alt+V' },
  { path: '/karma',       Icon: KarmaIcon, label: 'Karma Calculator',    shortcut: 'Alt+K' },
  { path: '/story',       Icon: StoryIcon, label: 'Story Mode',          shortcut: 'Alt+S' },
];

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    if (user) getChatHistory().then(setRecentChats).catch(() => {});
  }, [user]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      <aside
        className={`
          fixed left-0 top-0 h-full w-72 bg-[#0f0f0f] border-r border-white/5 z-30
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                style={{
                  fontFamily: 'Noto Serif Devanagari, serif',
                  color: '#FFD700',
                  fontSize: '18px',
                  lineHeight: '1',
                  display: 'block',
                  marginTop: '2px',
                }}
              >
                ॐ
              </span>
            </div>
            <div>
              <h1
                className="text-[#FFD700] font-bold text-xl leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Madhav.ai
              </h1>
              <p className="text-[#555] text-xs">Dharma-based Guidance</p>
            </div>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => { navigate('/'); close(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#0F5C4D]/40 text-[#0F5C4D] hover:bg-[#0F5C4D]/10 transition-all duration-200 text-sm font-medium"
          >
            <EditIcon className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {NAV.map(({ path, Icon, label, shortcut }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={close}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${active
                    ? 'bg-[#0F5C4D]/20 text-[#FFD700] border border-[#0F5C4D]/25'
                    : 'text-[#999] hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm flex-1">{label}</span>
                <span className="text-[10px] text-[#3a3a3a] group-hover:text-[#555] hidden xl:block font-mono">
                  {shortcut}
                </span>
              </Link>
            );
          })}

          {/* Recent Chats */}
          {recentChats.length > 0 && (
            <div className="pt-4">
              <p className="text-[#444] text-[10px] px-3 mb-2 uppercase tracking-widest font-medium">
                Recent
              </p>
              {recentChats.map((chat, i) => (
                <button
                  key={i}
                  onClick={() => { navigate('/'); close(); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-[#666] hover:bg-white/5 hover:text-[#aaa] transition-all duration-200 text-xs truncate"
                >
                  {chat.preview || 'Conversation'}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-[#0F5C4D]/30 border border-[#0F5C4D]/40 flex items-center justify-center text-[#FFD700] text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate font-medium">{user?.name || 'Parth'}</p>
              <p className="text-[#444] text-xs truncate">{user?.email || 'Guest'}</p>
            </div>
            <button
              onClick={logout}
              className="text-[#444] hover:text-[#FF7A00] transition-colors duration-200"
              title="Logout"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
