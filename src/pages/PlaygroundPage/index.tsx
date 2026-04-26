import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUp, Bot, User, Copy, Check, Zap, RotateCcw, Layers } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import PremiumIcon from '../../components/PremiumIcon';

const COLORS = {
  base: 'var(--bg-base)',
  card: 'var(--bg-card)',
  elevated: 'var(--bg-elevated)',
  border: 'var(--border-default)',
  purple: {
    primary: 'var(--purple-primary)',
    bright: 'var(--purple-bright)',
    wash: 'var(--purple-wash)',
    glow: 'var(--purple-glow)',
  },
  text: {
    primary: 'var(--text-primary)',
    muted: 'var(--text-secondary)',
    dim: 'var(--text-muted)',
  }
};

const MODELS = [
  { id: 'kimi-k2.5', name: 'kimi-k2.5', vision: true, provider: 'Moonshot' },
  { id: 'kimi-k2.5-lightning', name: 'kimi-k2.5-lightning', vision: true, provider: 'Moonshot' },
  { id: 'glm-5.1', name: 'glm-5.1', vision: false, provider: 'Zhipu' },
  { id: 'glm-5.1-precision', name: 'glm-5.1-precision', vision: false, provider: 'Zhipu' },
  { id: 'glm-5', name: 'glm-5', vision: false, provider: 'Zhipu' },
  { id: 'glm-4.7', name: 'glm-4.7', vision: false, provider: 'Zhipu' },
  { id: 'glm-4.7-flash', name: 'glm-4.7-flash', vision: false, provider: 'Zhipu' },
  { id: 'gemma-4-31b-it', name: 'gemma-4-31b-it', vision: true, provider: 'Google' },
  { id: 'minimax-m2.5', name: 'minimax-m2.5', vision: false, provider: 'MiniMax' },
  { id: 'qwen3.5-397b-a17b', name: 'qwen3.5-397b-a17b', vision: true, provider: 'Alibaba' },
  { id: 'qwen3.5-9b', name: 'qwen3.5-9b', vision: true, provider: 'Alibaba' },
  { id: 'deepseek-v3.2', name: 'deepseek-v3.2', vision: false, provider: 'DeepSeek' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  latency?: number;
}

const QUICK_STARTS = [
  "Explain transformers in 3 sentences",
  "Compare REST vs GraphQL",
  "Write a Python decorator"
];

const PRESETS = [
  { name: 'Creative', temp: 1.2, topP: 0.9 },
  { name: 'Balanced', temp: 0.7, topP: 0.9 },
  { name: 'Precise', temp: 0.2, topP: 0.5 },
];

function ModelSelector({ selected, onChange }: { selected: string; onChange: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedModel = MODELS.find(m => m.name === selected);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: COLORS.elevated, border: `1px solid ${COLORS.border}`,
          borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
          color: COLORS.text.primary, fontSize: '13px', fontFamily: '"JetBrains Mono", monospace',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399' }} />
        <span>{selected}</span>
        <ChevronDown size={14} strokeWidth={1.5} style={{ color: COLORS.text.muted }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              width: '240px', background: COLORS.card,
              border: `1px solid ${COLORS.border}`, borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
            }}
          >
            <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '6px' }}>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onChange(m.name); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left',
                    padding: '10px 12px', fontSize: '12px',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: m.name === selected ? COLORS.purple.bright : COLORS.text.muted,
                    background: m.name === selected ? COLORS.purple.wash : 'transparent',
                    border: 'none', borderLeft: m.name === selected ? `2px solid ${COLORS.purple.primary}` : '2px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <span>{m.name}</span>
                  <span style={{ fontSize: '10px', color: COLORS.text.dim }}>{m.provider}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: COLORS.text.dim, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", monospace' }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.purple.bright, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
          {value.toFixed(2)}
        </span>
      </div>
      <div style={{ position: 'relative', height: '4px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '4px', background: COLORS.elevated, borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.purple.primary}, ${COLORS.purple.bright})`, borderRadius: '99px' }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position: 'relative', width: '100%', height: '20px', appearance: 'none', background: 'transparent', cursor: 'pointer', zIndex: 1 }}
          className="crof-slider"
        />
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: '38px', height: '21px', borderRadius: '99px', border: 'none',
          background: value ? COLORS.purple.primary : COLORS.elevated,
          cursor: 'pointer', position: 'relative', transition: 'all 0.15s ease',
          boxShadow: value ? `0 0 8px ${COLORS.purple.glow}` : 'none',
        }}
      >
        <div style={{
          width: '15px', height: '15px', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '3px', left: value ? '20px' : '3px',
          transition: 'left 0.15s ease',
        }} />
      </button>
    </div>
  );
}

function ConfigSidebar({ 
  temperature, setTemperature, topP, setTopP, autoScroll, setAutoScroll, 
  streaming, setStreaming, fallback, setFallback, onReset, onClear, messageCount, model, systemPrompt, setSystemPrompt 
}: any) {
  const [activePreset, setActivePreset] = useState<string | null>('Balanced');

  const applyPreset = (preset: typeof PRESETS[0], name: string) => {
    setTemperature(preset.temp);
    setTopP(preset.topP);
    setActivePreset(name);
  };

  return (
    <div style={{
      width: '300px', flexShrink: 0,
      borderLeft: `1px solid ${COLORS.border}`,
      background: COLORS.card, overflowY: 'auto',
      padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: COLORS.text.dim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          CONFIG
        </span>
        <button
          onClick={onReset}
          style={{
            background: 'transparent', border: 'none', color: COLORS.text.muted,
            fontSize: '11px', cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.text.muted}
        >
          RESET
        </button>
      </div>

      {/* Presets */}
      <div>
        <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: COLORS.text.dim, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
          Presets
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset, preset.name)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
                fontFamily: '"JetBrains Mono", monospace',
                border: activePreset === preset.name ? `1px solid ${COLORS.purple.primary}` : `1px solid ${COLORS.border}`,
                background: activePreset === preset.name ? COLORS.purple.wash : 'transparent',
                color: activePreset === preset.name ? COLORS.purple.bright : COLORS.text.muted,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Slider label="Temperature" value={temperature} min={0} max={2} step={0.01} onChange={setTemperature} />
        <Slider label="Top P" value={topP} min={0} max={1} step={0.01} onChange={setTopP} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: COLORS.border }} />

      {/* Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toggle label="Streaming" value={streaming} onChange={setStreaming} />
        <Toggle label="Auto-scroll" value={autoScroll} onChange={setAutoScroll} />
        <Toggle label="Fallback servers" value={fallback} onChange={setFallback} />
      </div>

      {/* Session Info */}
      <div style={{ background: COLORS.base, borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: COLORS.text.dim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Session Info
        </span>
        <div style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.8 }}>
          <div>Model: <span style={{ color: COLORS.purple.bright }}>{model}</span></div>
          <div>Messages: <span style={{ color: COLORS.text.primary }}>{messageCount}</span></div>
          <div>Temp: <span style={{ color: COLORS.text.primary }}>{temperature.toFixed(2)}</span></div>
          <div>Top P: <span style={{ color: COLORS.text.primary }}>{topP.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClear}
        style={{
          width: '100%', padding: '10px 0', borderRadius: '6px',
          background: 'transparent', border: `1px solid ${COLORS.border}`,
          color: COLORS.text.muted, fontSize: '12px', cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace', transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#F87171'; e.currentTarget.style.color = '#F87171'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.text.muted; }}
      >
        Clear conversation
      </button>
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px' }}
    >
      {/* Animated Icon */}
      <PremiumIcon />

      {/* Title with gradient */}
      <h1 style={{
        fontSize: '24px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace',
        color: COLORS.text.primary,
        margin: 0, lineHeight: 1.2,
      }}>
        Welcome to Playground
      </h1>

      <p style={{ fontSize: '13px', color: COLORS.text.dim, margin: 0, textAlign: 'center', maxWidth: '300px', fontFamily: '"JetBrains Mono", monospace' }}>
        Select a model and start chatting. Compare responses or iterate on prompts.
      </p>

      {/* Quick Start Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
        {QUICK_STARTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSelect(prompt)}
            style={{
              padding: '10px 16px', borderRadius: '8px', border: `1px solid ${COLORS.border}`,
              background: COLORS.elevated, color: COLORS.text.muted, fontSize: '12px',
              fontFamily: '"JetBrains Mono", monospace', cursor: 'pointer', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = COLORS.purple.primary;
              e.currentTarget.style.color = COLORS.purple.bright;
              e.currentTarget.style.background = COLORS.purple.wash;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.color = COLORS.text.muted;
              e.currentTarget.style.background = COLORS.elevated;
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({ message, model, isStreaming }: { message: Message; model: string; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="message-enter"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%', gap: '6px',
      }}
    >
      {/* Role label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
        {isUser ? (
          <User size={14} strokeWidth={1.5} style={{ color: COLORS.text.dim }} />
        ) : (
          <Bot size={14} strokeWidth={1.5} style={{ color: COLORS.purple.bright }} />
        )}
        <span style={{ fontSize: '10px', color: COLORS.text.dim, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", monospace' }}>
          {isUser ? 'You' : model}
        </span>
        {!isUser && message.latency && (
          <span style={{ fontSize: '10px', color: COLORS.text.dim, fontFamily: '"JetBrains Mono", monospace' }}>
            · {message.latency}ms · {message.tokens} tokens
          </span>
        )}
      </div>

      {/* Message bubble */}
      <div style={{
        background: isUser ? COLORS.elevated : 'transparent',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '14px 18px',
        fontSize: '14px', color: COLORS.text.primary, lineHeight: 1.7, fontFamily: '"JetBrains Mono", monospace',
        border: isUser ? 'none' : `1px solid ${COLORS.border}`,
        whiteSpace: 'pre-wrap', position: 'relative',
      }}>
        {message.content}
        {isStreaming && (
          <motion.span
            className="streaming-cursor"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-block',
              width: '2px',
              height: '16px',
              background: COLORS.purple.bright,
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              borderRadius: '1px',
            }}
          />
        )}
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'transparent', border: 'none',
            color: copied ? '#34D399' : COLORS.text.dim, cursor: 'pointer',
            padding: '4px', opacity: 0.6, transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </motion.div>
  );
}

export default function PlaygroundPage() {
  const [model, setModel] = useState(MODELS[0].name);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [autoScroll, setAutoScroll] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({ tps: 45.2, ttft: 120, tokens: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, autoScroll]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);
    
    // Simulate streaming response
    const fullResponse = `I'm running on ${model} via CrofAI's inference API.\n\nThis is a simulated streaming response for demonstration purposes. In a real implementation, this would stream tokens in real-time as they're generated by the model.\n\nThe streaming architecture ensures:\n• Low-latency playback\n• Continuous frame delivery\n• No buffering delays\n• Smooth motion transitions`;
    
    // Create placeholder for streaming
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      tokens: 0,
      latency: 0
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    
    // Stream content character by character for real-time feel
    let streamedContent = '';
    const chars = fullResponse.split('');
    const startTime = Date.now();
    
    for (let i = 0; i < chars.length; i++) {
      streamedContent += chars[i];
      setMessages(prev => prev.map(m => 
        m.id === assistantMsgId 
          ? { ...m, content: streamedContent, tokens: i + 1 }
          : m
      ));
      
      // Vary the delay slightly for more natural feel
      const delay = Math.random() * 15 + 5;
      await new Promise(r => setTimeout(r, delay));
    }
    
    const endTime = Date.now();
    const latency = Math.round((endTime - startTime) / chars.length * 100);
    
    // Finalize message with metrics
    setMessages(prev => prev.map(m => 
      m.id === assistantMsgId 
        ? { 
            ...m, 
            tokens: chars.length,
            latency: latency
          }
        : m
    ));
    
    setMetrics(prev => ({ ...prev, tokens: prev.tokens + chars.length }));
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    }
  };

  const handleQuickStart = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextarea();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setMetrics(prev => ({ ...prev, tokens: 0 }));
  };

  const resetConfig = () => {
    setTemperature(0.7);
    setTopP(0.9);
  };

  return (
    <DashboardLayout currentPage="playground">
      <style>{`
        .crof-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: ${COLORS.purple.primary}; cursor: pointer;
          border: 2px solid ${COLORS.base};
          box-shadow: 0 0 8px ${COLORS.purple.glow};
          transition: transform 0.15s ease;
        }
        .crof-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .crof-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${COLORS.purple.primary}; cursor: pointer; border: 2px solid ${COLORS.base}; }
        .msgs::-webkit-scrollbar { width: 6px; }
        .msgs::-webkit-scrollbar-track { background: transparent; }
        .msgs::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 99px; }
        .msgs::-webkit-scrollbar-thumb:hover { background: ${COLORS.text.dim}; }
        
        /* Smooth message animations */
        .message-enter {
          animation: messageSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Streaming cursor animation */
        .streaming-cursor {
          animation: cursorBlink 0.8s ease-in-out infinite;
        }
        
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Smooth scroll behavior */
        .msgs {
          scroll-behavior: smooth;
        }
        
        /* Input focus transition */
        .chat-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        
        .chat-input:focus-within {
          border-color: ${COLORS.purple.glow};
          box-shadow: 0 0 0 3px ${COLORS.purple.wash}, 0 4px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 60px)', overflow: 'hidden', background: COLORS.base }}>
        
        {/* Sub-header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px', borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.card, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ModelSelector selected={model} onChange={setModel} />
            <span style={{
              fontSize: '11px', color: COLORS.text.dim, fontFamily: '"JetBrains Mono", monospace',
              padding: '4px 10px', background: COLORS.elevated, borderRadius: '99px',
            }}>
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ color: COLORS.purple.bright }}>{metrics.tps}</span> t/s
              </span>
              <span style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ color: COLORS.purple.bright }}>{metrics.ttft}</span>ms TTFT
              </span>
              <span style={{ fontSize: '11px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                <span style={{ color: COLORS.purple.bright }}>{metrics.tokens}</span> tokens
              </span>
            </div>
            <button
              onClick={() => {}}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '6px',
                background: COLORS.elevated, border: `1px solid ${COLORS.border}`,
                color: COLORS.text.muted, fontSize: '11px', cursor: 'pointer',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <Layers size={14} />
              CONFIG
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="msgs" 
              style={{ 
                flex: 1, overflowY: 'auto', padding: '20px', 
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}
            >
              {messages.length === 0 ? (
                <EmptyState onSelect={handleQuickStart} />
              ) : (
<AnimatePresence>
                  {messages.map((msg, idx) => (
                    <MessageBubble 
                      key={msg.id} 
                      message={msg} 
                      model={model} 
                      isStreaming={isLoading && idx === messages.length - 1}
                    />
                  ))}
                </AnimatePresence>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.15, 
                          ease: 'easeInOut' 
                        }}
                        style={{
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: COLORS.purple.primary
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: COLORS.text.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                    Generating...
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ 
              padding: '14px 24px 16px', borderTop: `1px solid ${COLORS.border}`, 
              background: COLORS.base, flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: COLORS.card, border: `1px solid ${COLORS.border}`,
                borderRadius: '12px', padding: '10px 12px 10px 18px', transition: 'all 0.15s ease',
              }}
                onFocusCapture={e => { 
                  if (input.trim()) {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(124,58,237,0.1)';
                  }
                }}
                onBlurCapture={e => { 
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <textarea
                  ref={textareaRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => { setInput(e.target.value); adjustTextarea(); }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none', fontSize: '14px', color: COLORS.text.primary,
                    fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5, minHeight: '22px', maxHeight: '140px', overflow: 'auto',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: input.trim() && !isLoading 
                      ? COLORS.purple.primary
                      : COLORS.elevated,
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease', color: input.trim() ? 'white' : '#5c5a75',
                    boxShadow: input.trim() ? '0 0 12px rgba(124,58,237,0.25)' : 'none',
                    opacity: input.trim() ? 1 : 0.5,
                  }}
                >
                  <ArrowUp size={16} strokeWidth={2} />
                </button>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '0 6px' }}>
                <span style={{ fontSize: '10px', color: '#5c5a75', fontFamily: '"JetBrains Mono", monospace', opacity: 0.6 }}>
                  ↵ send · ⇧↵ new line
                </span>
                <span style={{ fontSize: '10px', color: '#5c5a75', fontFamily: '"JetBrains Mono", monospace', opacity: 0.6 }}>
                  {input.length} chars
                </span>
              </div>
            </div>
          </div>

          {/* Config Sidebar */}
          <ConfigSidebar
            model={model}
            messageCount={messages.length}
            temperature={temperature} setTemperature={setTemperature}
            topP={topP} setTopP={setTopP}
            autoScroll={autoScroll} setAutoScroll={setAutoScroll}
            streaming={streaming} setStreaming={setStreaming}
            fallback={fallback} setFallback={setFallback}
            onReset={resetConfig}
            onClear={clearConversation}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}