import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import logoImage from '../../../assets/logonahcrof.jpg';
import './DashboardLayout.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'playground', label: 'Playground', href: '#/playground' },
  { id: 'docs', label: 'Docs', href: '#/docs' },
  { id: 'plan', label: 'Pricing', href: '#/plan' },
  { id: 'dedicated', label: 'Dedicated', href: '#/dedicated' },
  { id: 'dashboard', label: 'Dashboard', href: '#/dashboard' },
];

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className="dashboard-shell">
      <nav className="premium-nav" aria-label="Primary navigation">
        <a href="#/" className="premium-nav__brand" aria-label="CrofAI dashboard">
          <img src={logoImage} alt="" className="premium-nav__logo" />
          <span className="premium-nav__name">CrofAI</span>
        </a>

        <div className="premium-nav__tabs" role="list">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`premium-nav__tab${isActive ? ' premium-nav__tab--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="premium-nav__actions">
          <button
            type="button"
            className="premium-nav__icon-button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light theme' : 'Dark theme'}
          >
            {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          </button>

          <div className="premium-nav__profile" ref={profileRef}>
            <button
              type="button"
              className="premium-nav__profile-button"
              onClick={() => setProfileOpen(open => !open)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              <span className="premium-nav__avatar">
                <User size={15} strokeWidth={1.8} />
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={profileOpen ? 'premium-nav__chevron premium-nav__chevron--open' : 'premium-nav__chevron'}
              />
            </button>

            {profileOpen && (
              <div className="premium-nav__menu" role="menu">
                <div className="premium-nav__menu-header">
                  <span className="premium-nav__menu-name">CrofAI Workspace</span>
                  <span className="premium-nav__menu-email">developer@crof.ai</span>
                </div>
                <a
                  href="#/settings"
                  className="premium-nav__menu-item"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={15} strokeWidth={1.8} />
                  Settings
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ minHeight: '100%' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
