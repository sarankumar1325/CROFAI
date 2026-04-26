import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Copy, Trash2, Plus, Check, ChevronLeft, ChevronRight, X, Loader2, Key } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useTheme } from '../../contexts/ThemeContext';

// Theme-aware colors helper
const getThemeColors = (isDark: boolean) => ({
  bgBase: 'var(--bg-base)',
  bgCard: 'var(--bg-card)',
  bgElevated: 'var(--bg-elevated)',
  border: 'var(--border-default)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  purple: {
    primary: 'var(--purple-primary)',
    bright: 'var(--purple-bright)',
    wash: 'var(--purple-wash)',
    glow: 'var(--purple-glow)',
  },
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  chartGrid: 'var(--chart-grid)',
  chartBar: 'var(--chart-bar)',
  chartBarHover: 'var(--chart-bar-hover)',
});

// Token data in millions (M)
const APRIL_DATA = [0.8, 1.2, 2.1, 1.5, 2.8, 1.9, 3.2, 4.1, 5.2, 3.8, 2.9, 5.8, 7.2, 5.1, 3.4, 2.1, 4.5, 6.2, 3.8, 2.5, 1.8];
const CHART_MAX = Math.max(...APRIL_DATA);
const TOTAL_TOKENS_M = 65.2; // Total in millions
const INITIAL_SECONDS = 11 * 3600 + 40 * 60 + 43;

const API_KEYS = [
  { id: 'playground', name: 'playground', masked: '••••••••••••uSQc', full: 'sk-crof-xxxxxxxxxxxxxxxxxxxxxxxxuSQc' },
  { id: 'opencode', name: 'opencode', masked: '••••••••••••GPUN', full: 'sk-crof-xxxxxxxxxxxxxxxxxxxxxxxxGPUN' },
  { id: 'opencodeforreal', name: 'opencodeforreal', masked: '••••••••••••QTzD', full: 'sk-crof-xxxxxxxxxxxxxxxxxxxxxxxxQTzD' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: 'easeOut' as const, delay },
});

// Daily token usage configuration
const DAILY_TOKEN_LIMIT = 5000000; // 5M tokens per day
const DAILY_USED = 3215000; // 3.215M tokens used today

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Calculate percentage
function getUsagePercent(used: number, limit: number): number {
  return Math.min((used / limit) * 100, 100);
}

// Daily Token Usage Progress Component
function DailyTokenProgress({ used, limit }: { used: number; limit: number }) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const [showTooltip, setShowTooltip] = useState(false);
  const percent = getUsagePercent(used, limit);
  const remaining = Math.max(limit - used, 0);
  
  // Determine color based on usage
  const getColor = () => {
    if (percent >= 90) return colors.error;
    if (percent >= 70) return colors.warning;
    return colors.purple.primary;
  };
  const color = getColor();
  
  return (
    <motion.div 
      {...fadeUp(0.12)}
      style={{
        background: colors.bgCard, border: `1px solid ${colors.border}`,
        borderRadius: '12px', padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
            Daily Token Usage
          </span>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {percent.toFixed(0)}% Used
          </span>
        </div>
        
        {/* Main value display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontSize: '28px', fontWeight: 700, fontFamily: '"DM Mono", monospace',
            fontVariantNumeric: 'tabular-nums', color: colors.textPrimary, letterSpacing: '-0.02em',
          }}>
            {(used / 1000000).toFixed(2)}M
          </span>
          <span style={{ fontSize: '14px', color: colors.textMuted, fontFamily: '"DM Mono", monospace' }}>
            / {(limit / 1000000).toFixed(0)}M
          </span>
        </div>
        
        {/* Progress bar */}
        <div style={{ position: 'relative', height: '8px', background: colors.chartGrid, borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
              borderRadius: '99px',
              boxShadow: `0 0 12px ${color}40`,
            }}
          />
        </div>
        
        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <div>
            <span style={{ fontSize: '10px', color: colors.textMuted, display: 'block' }}>Used Today</span>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontFamily: '"DM Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
              {formatNumber(used)} tokens
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted, display: 'block' }}>Remaining</span>
            <span style={{ fontSize: '12px', color: remaining > 0 ? colors.success : colors.error, fontFamily: '"DM Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
              {formatNumber(remaining)} tokens
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Generate random API key
function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'sk-crof-';
  for (let i = 0; i < 28; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function StatCard({ label, value, sub, valueColor, delay = 0 }: {
  label: string; value: string; sub?: React.ReactNode; valueColor?: string; delay?: number;
}) {
  return (
    <motion.div {...fadeUp(delay)} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '6px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
        {label}
      </span>
      <span style={{
        fontSize: '24px', fontWeight: 700, fontFamily: '"DM Mono", monospace',
        fontVariantNumeric: 'tabular-nums', color: valueColor ?? 'var(--text-primary)', letterSpacing: '-0.02em',
      }}>
        {value}
      </span>
      {sub && <div style={{ marginTop: '2px' }}>{sub}</div>}
    </motion.div>
  );
}

function BarChart({ data }: { data: number[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const barW = 16;
  const gap = 10;
  const totalW = data.length * (barW + gap) + 40;

  return (
    <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
      <svg viewBox={`0 0 ${totalW} 160`} style={{ width: '100%', minWidth: `${totalW}px`, height: '160px', display: 'block' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(r => (
          <line key={r} x1="36" x2={totalW - 4} y1={28 + (1 - r) * 100} y2={28 + (1 - r) * 100}
            stroke="var(--chart-grid)" strokeWidth="1" />
        ))}
        {data.map((val, i) => {
          const barH = CHART_MAX > 0 ? (val / CHART_MAX) * 100 : 0;
          const x = 36 + i * (barW + gap);
          const y = 28 + (100 - barH);
          const isHov = hoveredIdx === i;
          return (
            <g key={i}>
              {/* Bar */}
              <rect x={x} y={y} width={barW} height={barH} rx="3"
                fill={isHov ? 'var(--chart-bar-hover)' : 'var(--chart-bar)'}
                style={{ transition: 'all 100ms' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              
              {/* Value label on top of bar */}
              <text 
                x={x + barW / 2} 
                y={y - 6} 
                textAnchor="middle" 
                fill={isHov ? 'var(--text-primary)' : 'var(--purple-bright)'}
                fontSize="9"
                fontFamily='"DM Mono", monospace'
                fontWeight={600}
                style={{ 
                  transition: 'fill 100ms',
                  opacity: isHov ? 1 : 0.9 
                }}
              >
                {val.toFixed(1)}M
              </text>
              {isHov && val > 0 && (
                <g>
                  <rect x={x - 10} y={y - 24} width={40} height={20} rx="4" fill="var(--bg-elevated)" />
                  <text x={x + barW / 2} y={y - 10} textAnchor="middle" fill="var(--text-primary)" fontSize="10"
                    fontFamily='"DM Mono", monospace'>{val.toFixed(1)}M</text>
                </g>
              )}
              <rect x={x - 4} y={8} width={barW + 8} height={108} fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
              {(i % 4 === 0 || i === data.length - 1) && (
                <text x={x + barW / 2} y={128} textAnchor="middle" fill="var(--text-muted)" fontSize="9"
                  fontFamily='"DM Mono", monospace'>{i + 1}</text>
              )}
            </g>
          );
        })}
        <text x="4" y="60" fill="var(--text-muted)" fontSize="9" fontFamily='"DM Mono", monospace'
          textAnchor="middle" transform="rotate(-90,12,58)">M tokens</text>
      </svg>
    </div>
  );
}

function ApiKeyRow({ apiKey, copied, onCopy, onDelete, isLast }: {
  apiKey: typeof API_KEYS[0]; copied: boolean; onCopy: () => void; onDelete: () => void; isLast: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px',
      background: hov ? 'var(--surface-hover)' : 'transparent',
      borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
      transition: 'background 150ms',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', fontFamily: '"DM Mono", monospace' }}>
          {apiKey.name}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em' }}>
          {apiKey.masked}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px', opacity: hov ? 1 : 0, transition: 'opacity 150ms' }}>
        <button type="button" title={copied ? 'Copied!' : 'Copy key'} onClick={onCopy} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '30px', height: '30px', borderRadius: '6px',
          background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
          color: copied ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 150ms',
        }}>
          {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.5} />}
        </button>
        <button type="button" title="Delete key" onClick={onDelete} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '30px', height: '30px', borderRadius: '6px',
          background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 150ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.borderColor = 'var(--error)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <Trash2 size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function CreateKeyModal({ isOpen, onClose, onKeyCreated }: {
  isOpen: boolean; onClose: () => void; onKeyCreated: (key: { id: string; name: string; masked: string; full: string }) => void;
}) {
  const [step, setStep] = useState<'idle' | 'generating' | 'success'>('idle');
  const [keyName, setKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!keyName.trim()) return;
    
    setStep('generating');
    
    // Simulate async loading (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newKey = generateApiKey();
    setGeneratedKey(newKey);
    setStep('success');
  };

  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    
    // Create the key entry
    const masked = '••••••••••••' + generatedKey.slice(-4);
    onKeyCreated({
      id: Date.now().toString(),
      name: keyName.trim(),
      masked,
      full: generatedKey
    });
    
    setTimeout(() => {
      setStep('idle');
      setKeyName('');
      setGeneratedKey('');
      setCopied(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep('idle');
    setKeyName('');
    setGeneratedKey('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: '16px', width: '420px', maxWidth: '90vw', overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={18} strokeWidth={1.5} style={{ color: 'var(--purple-primary)' }} />
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
              CREATE API KEY
            </span>
          </div>
          <button onClick={handleClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px',
            display: 'flex', transition: 'color 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px' }}>
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Key Name
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder="e.g., production, development, testing"
                  style={{
                    width: '100%', padding: '12px 14px', background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)', borderRadius: '8px',
                    fontSize: '14px', color: 'var(--text-primary)', fontFamily: '"DM Mono", monospace',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--purple-primary)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.5 }}>
                  This key will be used to authenticate API requests. Keep it secure and never share it publicly.
                </p>
              </motion.div>
            )}

            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={32} strokeWidth={1.5} style={{ color: 'var(--purple-primary)' }} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: '"DM Mono", monospace' }}>
                    Generating your API key...
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Please wait while we create a secure key
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Success indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={18} strokeWidth={2} style={{ color: 'var(--success)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--success)', fontFamily: '"DM Mono", monospace', fontWeight: 600 }}>
                      API Key Created Successfully!
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Copy your key below. It won't be shown again.
                    </p>
                  </div>
                </div>

                {/* Generated key display */}
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--purple-glow)',
                  borderRadius: '8px', padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <code style={{
                    flex: 1, fontSize: '12px', color: 'var(--purple-bright)', fontFamily: '"DM Mono", monospace',
                    wordBreak: 'break-all',
                  }}>
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedKey)}
                    style={{
                      background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
                      borderRadius: '6px', padding: '6px', color: 'var(--text-secondary)', cursor: 'pointer',
                      display: 'flex', transition: 'all 150ms',
                    }}
                  >
                    <Copy size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          padding: '16px 20px', borderTop: '1px solid var(--border-subtle)',
        }}>
          {step === 'idle' && (
            <>
              <button onClick={handleClose} style={{
                padding: '10px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: '"DM Mono", monospace',
                background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 150ms',
              }}>
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!keyName.trim()}
                style={{
                  padding: '10px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: '"DM Mono", monospace',
                  background: keyName.trim() ? 'var(--purple-primary)' : 'var(--purple-wash)',
                  border: 'none', color: 'white', cursor: keyName.trim() ? 'pointer' : 'default',
                  transition: 'all 150ms', opacity: keyName.trim() ? 1 : 0.5,
                }}
              >
                Generate Key
              </button>
            </>
          )}
          {step === 'success' && (
            <button
              onClick={handleCopyAndClose}
              style={{
                padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontFamily: '"DM Mono", monospace',
                background: 'var(--success)', border: 'none', color: 'var(--bg-base)', cursor: 'pointer',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 150ms',
              }}
            >
              {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
              {copied ? 'Copied!' : 'Copy & Close'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            background: 'var(--bg-card)', border: '1px solid var(--success)',
            borderRadius: '10px', padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: 'var(--shadow-lg)', zIndex: 300,
          }}
        >
          <Check size={16} strokeWidth={2} style={{ color: 'var(--success)' }} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: '"DM Mono", monospace' }}>
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DashboardPage() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [keys, setKeys] = useState(API_KEYS);
  const [chartMonth] = useState('April 2026');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const countdown = `${pad(h)}:${pad(m)}:${pad(s)}`;

  const copyKey = (id: string, full: string) => {
    navigator.clipboard.writeText(full).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleKeyCreated = (newKey: typeof API_KEYS[0]) => {
    setKeys(prev => [...prev, newKey]);
    showToast(`API key "${newKey.name}" created successfully!`);
  };

  return (
    <DashboardLayout currentPage="dashboard">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 24px', width: '100%', boxSizing: 'border-box' }}>
        {/* Page header */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '36px', letterSpacing: '0.08em', color: 'var(--text-primary)', lineHeight: 1 }}>
            DASHBOARD
          </h1>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.02em' }}>
            Monitor usage, credits, and API keys.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}
          className="lg:grid-cols-4">
          <StatCard
            label="Total Tokens" value={`${TOTAL_TOKENS_M}M`} delay={0.04} valueColor="var(--purple-primary)"
            sub={<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={11} strokeWidth={1.5} style={{ color: 'var(--success)' }} />
              <span style={{ fontSize: '11px', color: 'var(--success)', fontFamily: '"DM Mono", monospace' }}>+12.5% this month</span>
            </div>}
          />
          <StatCard label="Credits" value="$-0.000" delay={0.08} valueColor="var(--warning)"
            sub={<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: '"DM Mono", monospace' }}>Top up to continue</span>}
          />
          <DailyTokenProgress used={DAILY_USED} limit={DAILY_TOKEN_LIMIT} />
          <StatCard label="Resets In" value={countdown} delay={0.16}
            sub={<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: '"DM Mono", monospace' }}>Daily limit</span>
            </div>}
          />
        </div>

        {/* Chart */}
        <motion.div {...fadeUp(0.2)} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', padding: '20px', marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <button type="button" title="Previous month" style={{
              background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
              borderRadius: '6px', padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '16px', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
              TOKENS USED — {chartMonth.toUpperCase()}
            </span>
            <button type="button" title="Next month" style={{
              background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
              borderRadius: '6px', padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
          <BarChart data={APRIL_DATA} />
        </motion.div>

        {/* API Keys */}
        <motion.div {...fadeUp(0.24)} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ padding: '20px 20px 16px' }}>
            <h2 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
              API KEYS
            </h2>
            <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.02em' }}>
              Tokens used for authenticating API requests.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {keys.length === 0 && (
              <div style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontFamily: '"DM Mono", monospace' }}>
                No API keys. Create one below.
              </div>
            )}
            {keys.map((key, idx) => (
              <ApiKeyRow
                key={key.id}
                apiKey={key}
                copied={copiedId === key.id}
                onCopy={() => copyKey(key.id, key.full)}
                onDelete={() => setKeys(prev => prev.filter(k => k.id !== key.id))}
                isLast={idx === keys.length - 1}
              />
            ))}
          </div>

          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={() => setShowCreateModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500, color: 'var(--purple-primary)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', transition: 'color 150ms',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--purple-bright)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--purple-primary)')}
            >
              <Plus size={13} strokeWidth={2} />
              Create New Key
            </button>
          </div>
        </motion.div>
      </div>

      {/* Create Key Modal */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onKeyCreated={handleKeyCreated}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} isVisible={toast.visible} />
    </DashboardLayout>
  );
}