import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, CreditCard, Sun, Moon } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useTheme } from '../../contexts/ThemeContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: 'easeOut' as const, delay },
});

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 style={{
      fontFamily: '"Bebas Neue", sans-serif',
      fontSize: '20px', letterSpacing: '0.1em',
      color: 'var(--text-primary)', lineHeight: 1, marginBottom: '16px',
    }}>
      {children}
    </h2>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const isDark = theme === 'dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '14px 16px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
        borderRadius: '10px', cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(251, 191, 36, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isDark ? (
            <Moon size={18} strokeWidth={1.5} style={{ color: '#A78BFA' }} />
          ) : (
            <Sun size={18} strokeWidth={1.5} style={{ color: '#FBBF24' }} />
          )}
        </div>
        <div style={{ textAlign: 'left' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500,
            color: 'var(--text-primary)', display: 'block',
          }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-muted)', display: 'block', marginTop: '2px',
          }}>
            {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
          </span>
        </div>
      </div>
      
      {/* Toggle indicator */}
      <div style={{
        width: '44px', height: '24px', borderRadius: '99px',
        background: isDark ? 'var(--purple-primary)' : 'var(--border-default)',
        position: 'relative', transition: 'all 200ms ease',
      }}>
        <motion.div
          animate={{ x: isDark ? 22 : 2 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: '2px',
            width: '20px', height: '20px', borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </motion.button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontFamily: '"DM Mono", monospace',
      fontSize: '10px', color: '#5C566A',
      textTransform: 'uppercase' as const, letterSpacing: '0.08em',
      fontWeight: 500, display: 'block', marginBottom: '6px',
    }}>
      {children}
    </label>
  );
}

function TextInput({
  type = 'text', placeholder, value, onChange,
}: { type?: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={isPassword && showPw ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: isPassword ? '9px 38px 9px 12px' : '9px 12px',
          fontSize: '13px', color: '#F4F0FB', outline: 'none',
          fontFamily: '"Geist", system-ui, sans-serif',
          transition: 'border-color 150ms', boxSizing: 'border-box' as const,
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
      {isPassword && (
        <button
          type="button"
          title={showPw ? 'Hide password' : 'Show password'}
          onClick={() => setShowPw(v => !v)}
          style={{
            position: 'absolute', right: '10px', top: '50%',
            transform: 'translateY(-50%)', background: 'none',
            border: 'none', color: '#5C566A', cursor: 'pointer',
            padding: '2px', display: 'flex', alignItems: 'center',
          }}
        >
          {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
        </button>
      )}
    </div>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '8px 18px', borderRadius: '8px',
      fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500,
      cursor: 'pointer', transition: 'background 150ms',
      background: '#7C3AED', color: 'white', border: 'none', letterSpacing: '0.04em',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#8B5CF6')}
      onMouseLeave={e => (e.currentTarget.style.background = '#7C3AED')}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '8px 16px', borderRadius: '8px',
      fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500,
      cursor: 'pointer', transition: 'all 150ms',
      background: 'rgba(255,255,255,0.05)', color: '#8B8598',
      border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.04em',
      display: 'flex', alignItems: 'center', gap: '6px',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#F4F0FB'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8B8598'; }}
    >
      {children}
    </button>
  );
}

const HR = () => <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '32px 0' }} />;

const CREDIT_AMOUNTS = [10, 25, 50, 100];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [billingEmail, setBillingEmail] = useState('sarankumar131313@gmail.com');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedAmt, setSelectedAmt] = useState<number | null>(10);

  return (
    <DashboardLayout currentPage="settings">
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box' }}>
        {/* Page title */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '36px', letterSpacing: '0.08em', color: '#F4F0FB', lineHeight: 1 }}>
            SETTINGS
          </h1>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#5C566A', marginTop: '6px', letterSpacing: '0.02em' }}>
            Manage your account, billing, and preferences.
          </p>
        </motion.div>

        {/* ── Account ── */}
        <motion.section {...fadeUp(0.06)}>
          <SectionTitle>Account</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              padding: '11px 14px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
            }}>
              <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: '#5C566A', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Signed in as
              </p>
              <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '13px', color: '#8B8598' }}>
                sarankumar131313@gmail.com
              </p>
            </div>
            <div>
              <Label>Billing Email</Label>
              <TextInput placeholder="billing@example.com" value={billingEmail} onChange={setBillingEmail} />
            </div>
            <div><PrimaryBtn>Update Email</PrimaryBtn></div>
          </div>
        </motion.section>

        <HR />

        {/* ── Password ── */}
        <motion.section {...fadeUp(0.1)}>
          <SectionTitle>Change Password</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <Label>Current Password</Label>
              <TextInput type="password" placeholder="••••••••" value={currentPw} onChange={setCurrentPw} />
            </div>
            <div>
              <Label>New Password</Label>
              <TextInput type="password" placeholder="••••••••" value={newPw} onChange={setNewPw} />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <TextInput type="password" placeholder="••••••••" value={confirmPw} onChange={setConfirmPw} />
              {newPw && confirmPw && newPw !== confirmPw && (
                <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#F87171', marginTop: '5px' }}>
                  Passwords don't match.
                </p>
              )}
            </div>
            <div><PrimaryBtn>Update Password</PrimaryBtn></div>
          </div>
        </motion.section>

        <HR />

        {/* ── Appearance ── */}
        <motion.section {...fadeUp(0.14)}>
          <SectionTitle>Appearance</SectionTitle>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </motion.section>

        <HR />

        {/* ── Credits ── */}
        <motion.section {...fadeUp(0.18)}>
          <SectionTitle>Credits</SectionTitle>
          <div style={{ marginBottom: '18px' }}>
            <Label>Current Balance</Label>
            <span style={{
              fontFamily: '"DM Mono", monospace', fontSize: '26px', fontWeight: 700,
              color: '#FBBF24', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
            }}>
              $-0.000
            </span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Label>Add Credits to Your Account</Label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CREDIT_AMOUNTS.map(amt => (
                <button key={amt} type="button" onClick={() => setSelectedAmt(amt)} style={{
                  padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 500,
                  transition: 'all 150ms',
                  background: selectedAmt === amt ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                  color: selectedAmt === amt ? '#A78BFA' : '#8B8598',
                  border: `1px solid ${selectedAmt === amt ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  ${amt}
                </button>
              ))}
            </div>
          </div>
          <PrimaryBtn>Add Credits</PrimaryBtn>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: '#5C566A', marginTop: '10px' }}>
            Minimum $2. Credits are added instantly after payment.
          </p>
        </motion.section>

        <HR />

        {/* ── Payment ── */}
        <motion.section {...fadeUp(0.22)}>
          <SectionTitle>Payment</SectionTitle>
          <GhostBtn>
            <CreditCard size={14} strokeWidth={1.5} />
            Manage Payment Methods
          </GhostBtn>
        </motion.section>

        <HR />

        {/* ── Danger Zone ── */}
        <motion.section {...fadeUp(0.26)}>
          <div style={{
            border: '1px solid rgba(248,113,113,0.2)', borderRadius: '12px',
            padding: '22px', background: 'rgba(248,113,113,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertTriangle size={15} strokeWidth={1.5} style={{ color: '#F87171', flexShrink: 0 }} />
              <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.1em', color: '#F87171', lineHeight: 1 }}>
                DANGER ZONE
              </h3>
            </div>
            <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#8B8598', marginBottom: '18px', lineHeight: 1.6 }}>
              This action is irreversible. All API keys, usage data, and account information will be permanently deleted.
            </p>

            {!deleteConfirm ? (
              <button type="button" onClick={() => setDeleteConfirm(true)} style={{
                padding: '8px 16px', borderRadius: '8px',
                fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', transition: 'background 150ms', letterSpacing: '0.04em',
                background: 'rgba(248,113,113,0.10)', color: '#F87171',
                border: '1px solid rgba(248,113,113,0.2)',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.10)')}
              >
                Delete Account
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#F87171', fontWeight: 500 }}>
                  Are you sure? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" style={{
                    padding: '8px 16px', borderRadius: '8px',
                    fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer', background: '#DC2626', color: 'white',
                    border: 'none', transition: 'background 150ms', letterSpacing: '0.04em',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#B91C1C')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#DC2626')}
                  >
                    Yes, Delete My Account
                  </button>
                  <GhostBtn onClick={() => setDeleteConfirm(false)}>Cancel</GhostBtn>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        <div style={{ height: '48px' }} />
      </div>
    </DashboardLayout>
  );
}
