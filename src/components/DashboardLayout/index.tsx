import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, LayoutDashboard,
  Settings, LogOut, Menu, X, Swords, Zap,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'playground', label: 'Playground', icon: Terminal, href: '#/playground' },
  { id: 'arena', label: 'Arena', icon: Swords, href: '#/arena' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '#/dashboard' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div style={{
      background: 'var(--bg-base)',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-mono)',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Horizontal Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border-default)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: isDark ? 'rgba(10, 10, 16, 0.8)' : 'rgba(248, 249, 250, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        {/* Logo - Icon only */}
        <a href="#/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: `linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)`,
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5L7 3.5L11 7.5L7 11.5L3 7.5Z" fill="white" fillOpacity="0.95" />
              <path d="M7 3.5L13 7.5L7 11.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
            </svg>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 150ms',
                  background: isActive ? 'var(--purple-wash)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--purple-primary)' : '2px solid transparent',
                  color: isActive ? 'var(--purple-bright)' : 'var(--text-secondary)',
                }}
              >
                <Icon size={16} strokeWidth={1.5} style={{ opacity: isActive ? 1 : 0.65 }} />
                <span style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.01em',
                }}>
                  {item.label}
                </span>
              </a>
            );
          })}
          <a
            href="#/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 150ms',
              color: 'var(--text-secondary)',
            }}
          >
            <LogOut size={16} strokeWidth={1.5} style={{ opacity: 0.65 }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.01em',
            }}>
              Logout
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
          }}
        />
      )}

      {/* Mobile Menu */}
      <div className="md:hidden" style={{
        position: 'fixed',
        top: '60px',
        left: mobileOpen ? 0 : '-100%',
        bottom: 0,
        width: '100%',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '8px',
        zIndex: 100,
        transition: 'left 220ms cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto',
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 150ms',
                background: isActive ? 'var(--purple-wash)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--purple-primary)' : '2px solid transparent',
                color: isActive ? 'var(--purple-bright)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} strokeWidth={1.5} style={{ opacity: isActive ? 1 : 0.65 }} />
              <span style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-mono)',
              }}>
                {item.label}
              </span>
            </a>
          );
        })}
        <a
          href="#/"
          onClick={() => setMobileOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            marginTop: '8px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <LogOut size={18} strokeWidth={1.5} style={{ opacity: 0.65 }} />
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
          }}>
            Logout
          </span>
        </a>
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginTop: '60px',
        minHeight: 'calc(100dvh - 60px)',
        overflowX: 'hidden',
      }}>
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