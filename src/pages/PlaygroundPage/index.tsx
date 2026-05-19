import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Bot, Check, ChevronDown, Copy, PanelRightClose, PanelRightOpen, RotateCcw, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import PremiumIcon from '../../components/PremiumIcon';
import './PlaygroundPage.css';

const MODELS = [
  { id: 'deepseek-v4-pro', name: 'deepseek-v4-pro', provider: 'DeepSeek' },
  { id: 'deepseek-v4-pro-precision', name: 'deepseek-v4-pro-precision', provider: 'DeepSeek' },
  { id: 'deepseek-v4-flash', name: 'deepseek-v4-flash', provider: 'DeepSeek' },
  { id: 'deepseek-v3.2', name: 'deepseek-v3.2', provider: 'DeepSeek' },
  { id: 'glm-5.1', name: 'glm-5.1', provider: 'Zhipu' },
  { id: 'glm-5.1-precision', name: 'glm-5.1-precision', provider: 'Zhipu' },
  { id: 'greg', name: 'greg', provider: 'CrofAI' },
  { id: 'kimi-k2.6', name: 'kimi-k2.6', provider: 'Moonshot' },
  { id: 'kimi-k2.6-precision', name: 'kimi-k2.6-precision', provider: 'Moonshot' },
  { id: 'kimi-k2.5', name: 'kimi-k2.5', provider: 'Moonshot' },
  { id: 'kimi-k2.5-lightning', name: 'kimi-k2.5-lightning', provider: 'Moonshot' },
  { id: 'glm-5', name: 'glm-5', provider: 'Zhipu' },
  { id: 'glm-4.7', name: 'glm-4.7', provider: 'Zhipu' },
  { id: 'glm-4.7-flash', name: 'glm-4.7-flash', provider: 'Zhipu' },
  { id: 'gemma-4-31b-it', name: 'gemma-4-31b-it', provider: 'Google' },
  { id: 'minimax-m2.5', name: 'minimax-m2.5', provider: 'MiniMax' },
  { id: 'qwen3.6-27b', name: 'qwen3.6-27b', provider: 'Alibaba' },
  { id: 'qwen3.5-397b-a17b', name: 'qwen3.5-397b-a17b', provider: 'Alibaba' },
  { id: 'qwen3.5-9b', name: 'qwen3.5-9b', provider: 'Alibaba' },
  { id: 'qwen3.5-9b-chat', name: 'qwen3.5-9b-chat', provider: 'Alibaba' },
];

const QUICK_STARTS = [
  'Explain transformers in 3 sentences',
  'Compare REST vs GraphQL',
  'Write a Python decorator',
];

const PRESETS = [
  { name: 'Creative', temp: 1.2, topP: 0.9 },
  { name: 'Balanced', temp: 0.7, topP: 0.9 },
  { name: 'Precise', temp: 0.2, topP: 0.5 },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  latency?: number;
}

function DotmSquare2({
  size = 32,
  dotSize = 4,
  speed = 1.2,
  bloom = true,
  ariaLabel = 'Loading',
}: {
  size?: number;
  dotSize?: number;
  speed?: number;
  bloom?: boolean;
  ariaLabel?: string;
}) {
  const cells = Array.from({ length: 25 }, (_, index) => index);
  const duration = 1.4 / Math.max(speed, 0.1);

  return (
    <span
      className={`dotm-square${bloom ? ' dotm-square--bloom' : ''}`}
      role="status"
      aria-label={ariaLabel}
      style={{
        '--dotm-size': `${size}px`,
        '--dotm-dot': `${dotSize}px`,
        '--dotm-duration': `${duration}s`,
      } as CSSProperties}
    >
      {cells.map(index => (
        <span key={index} style={{ '--dotm-index': index } as CSSProperties} />
      ))}
    </span>
  );
}

function ModelSelector({ selected, onChange }: { selected: string; onChange: (model: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selectedModel = MODELS.find(model => model.name === selected) ?? MODELS[0];
  const filteredModels = MODELS.filter(model => model.name.toLowerCase().includes(query.toLowerCase()) || model.provider.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="playground-model" ref={ref}>
      <button type="button" className="playground-model__button" onClick={() => setOpen(value => !value)}>
        <span className="playground-model__status" />
        <span className="playground-model__copy">
          <strong>{selectedModel.name}</strong>
        </span>
        <ChevronDown size={16} strokeWidth={1.8} className={open ? 'playground-model__chevron playground-model__chevron--open' : 'playground-model__chevron'} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="playground-model__menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <div className="playground-model__search">
              <Search size={14} strokeWidth={1.8} />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search models" />
            </div>
            <div className="playground-model__list">
              {filteredModels.map(model => {
                const isActive = model.name === selected;
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={isActive ? 'playground-model__item playground-model__item--active' : 'playground-model__item'}
                    onClick={() => {
                      onChange(model.name);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <span>{model.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <label className="playground-field">
      <span>
        {label}
        <strong>{value.toFixed(2)}</strong>
      </span>
      <input
        className="playground-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={event => onChange(parseFloat(event.target.value))}
        style={{ '--slider-fill': `${pct}%` } as CSSProperties}
      />
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" className="playground-toggle-row" onClick={() => onChange(!value)}>
      <span>{label}</span>
      <span className={value ? 'playground-toggle playground-toggle--on' : 'playground-toggle'}>
        <span />
      </span>
    </button>
  );
}

function ConfigPanel({
  isOpen,
  temperature,
  setTemperature,
  topP,
  setTopP,
  autoScroll,
  setAutoScroll,
  streaming,
  setStreaming,
  fallback,
  setFallback,
  onReset,
  onClear,
  messageCount,
  model,
}: {
  isOpen: boolean;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
  streaming: boolean;
  setStreaming: (value: boolean) => void;
  fallback: boolean;
  setFallback: (value: boolean) => void;
  onReset: () => void;
  onClear: () => void;
  messageCount: number;
  model: string;
}) {
  const [activePreset, setActivePreset] = useState('Balanced');

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setTemperature(preset.temp);
    setTopP(preset.topP);
    setActivePreset(preset.name);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          className="playground-config"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="playground-config__inner">
            <div className="playground-config__header">
              <div>
                <span>Config</span>
                <strong>Runtime controls</strong>
              </div>
              <button type="button" onClick={onReset}>
                <RotateCcw size={14} strokeWidth={1.8} />
                Reset
              </button>
            </div>

            <section className="playground-config__section">
              <p>Presets</p>
              <div className="playground-presets">
                {PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    className={activePreset === preset.name ? 'playground-presets__item playground-presets__item--active' : 'playground-presets__item'}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="playground-config__section">
              <Slider label="Temperature" value={temperature} min={0} max={2} step={0.01} onChange={setTemperature} />
              <Slider label="Top P" value={topP} min={0} max={1} step={0.01} onChange={setTopP} />
            </section>

            <section className="playground-config__section">
              <Toggle label="Streaming" value={streaming} onChange={setStreaming} />
              <Toggle label="Auto-scroll" value={autoScroll} onChange={setAutoScroll} />
              <Toggle label="Fallback servers" value={fallback} onChange={setFallback} />
            </section>

            <section className="playground-session">
              <p>Session Info</p>
              <dl>
                <div><dt>Model</dt><dd>{model}</dd></div>
                <div><dt>Messages</dt><dd>{messageCount}</dd></div>
                <div><dt>Temp</dt><dd>{temperature.toFixed(2)}</dd></div>
                <div><dt>Top P</dt><dd>{topP.toFixed(2)}</dd></div>
              </dl>
            </section>

            <button type="button" className="playground-clear" onClick={onClear}>
              Clear conversation
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <motion.div
      className="playground-empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <PremiumIcon />
      <div className="playground-empty__copy">
        <h1>Prompt, stream, compare the feel.</h1>
        <p>Choose a model, tune the run, and test responses in a focused workspace.</p>
      </div>
      <div className="playground-prompts">
        {QUICK_STARTS.map(prompt => (
          <button key={prompt} type="button" onClick={() => onSelect(prompt)}>
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
    navigator.clipboard.writeText(message.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      className={isUser ? 'playground-message playground-message--user' : 'playground-message'}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="playground-message__meta">
        {isUser ? <User size={14} strokeWidth={1.6} /> : <Bot size={14} strokeWidth={1.6} />}
        <span>{isUser ? 'You' : model}</span>
        {!isUser && message.latency ? <small>{message.latency}ms · {message.tokens} tokens</small> : null}
      </div>
      <div className="playground-message__bubble">
        {message.content}
        {isStreaming ? <span className="playground-cursor" /> : null}
        <button type="button" onClick={handleCopy} aria-label="Copy message">
          {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.7} />}
        </button>
      </div>
    </motion.div>
  );
}

export default function PlaygroundPage() {
  const [model, setModel] = useState('glm-4.7');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [autoScroll, setAutoScroll] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
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
        behavior: 'smooth',
      });
    }
  }, [messages, autoScroll]);

  const adjustTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    const fullResponse = `Running ${model} through CrofAI.\n\nThis simulated response streams tokens into the playground so you can judge latency, formatting, and config behavior before connecting a live backend.\n\nCurrent run:\n- Temperature: ${temperature.toFixed(2)}\n- Top P: ${topP.toFixed(2)}\n- Fallback servers: ${fallback ? 'enabled' : 'disabled'}`;
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      tokens: 0,
      latency: 0,
    };

    setMessages(prev => [...prev, assistantMessage]);

    let streamedContent = '';
    const chars = fullResponse.split('');
    const start = Date.now();

    if (streaming) {
      for (let index = 0; index < chars.length; index++) {
        streamedContent += chars[index];
        setMessages(prev => prev.map(message => (
          message.id === assistantId ? { ...message, content: streamedContent, tokens: index + 1 } : message
        )));
        await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 4));
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 700));
      streamedContent = fullResponse;
    }

    const latency = Math.round((Date.now() - start) / Math.max(chars.length, 1) * 100);
    setMessages(prev => prev.map(message => (
      message.id === assistantId ? { ...message, content: streamedContent, tokens: chars.length, latency } : message
    )));
    setMetrics(prev => ({ ...prev, tokens: prev.tokens + chars.length, ttft: latency }));
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleQuickStart = (prompt: string) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      adjustTextarea();
    });
  };

  const clearConversation = () => {
    setMessages([]);
    setMetrics(prev => ({ ...prev, tokens: 0 }));
  };

  const resetConfig = () => {
    setTemperature(0.7);
    setTopP(0.9);
    setAutoScroll(true);
    setStreaming(true);
    setFallback(false);
  };

  return (
    <DashboardLayout currentPage="playground">
      <div className="playground-page">
        <header className="playground-topbar">
          <div className="playground-topbar__left">
            <ModelSelector selected={model} onChange={setModel} />
            <span className="playground-pill">{messages.length} message{messages.length === 1 ? '' : 's'}</span>
          </div>
          <div className="playground-topbar__right">
            <div className="playground-metrics">
              <span><strong>{metrics.tps}</strong> t/s</span>
              <span><strong>{metrics.ttft}</strong>ms TTFT</span>
              <span><strong>{metrics.tokens}</strong> tokens</span>
            </div>
            <button type="button" className="playground-config-button" onClick={() => setConfigOpen(open => !open)}>
              {configOpen ? <PanelRightClose size={15} strokeWidth={1.8} /> : <PanelRightOpen size={15} strokeWidth={1.8} />}
              Config
            </button>
          </div>
        </header>

        <div className="playground-workspace">
          <section className="playground-chat">
            <div ref={messagesContainerRef} className="playground-messages">
              {messages.length === 0 ? (
                <EmptyState onSelect={handleQuickStart} />
              ) : (
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      model={model}
                      isStreaming={isLoading && index === messages.length - 1}
                    />
                  ))}
                </AnimatePresence>
              )}

              {isLoading ? (
                <motion.div
                  className="playground-loading"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <DotmSquare2 size={32} dotSize={4} speed={1.2} bloom />
                  <span>Generating</span>
                </motion.div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <footer className="playground-composer">
              <div className="playground-composer__box">
                <textarea
                  ref={textareaRef}
                  value={input}
                  placeholder="Ask CrofAI anything..."
                  rows={1}
                  onChange={event => {
                    setInput(event.target.value);
                    adjustTextarea();
                  }}
                  onKeyDown={handleKeyDown}
                />
                <button type="button" onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Send message">
                  <ArrowUp size={17} strokeWidth={2} />
                </button>
              </div>
              <div className="playground-composer__meta">
                <span>Enter to send · Shift Enter for new line</span>
                <span>{input.length} chars</span>
              </div>
            </footer>
          </section>

          <ConfigPanel
            isOpen={configOpen}
            model={model}
            messageCount={messages.length}
            temperature={temperature}
            setTemperature={setTemperature}
            topP={topP}
            setTopP={setTopP}
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
            streaming={streaming}
            setStreaming={setStreaming}
            fallback={fallback}
            setFallback={setFallback}
            onReset={resetConfig}
            onClear={clearConversation}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
