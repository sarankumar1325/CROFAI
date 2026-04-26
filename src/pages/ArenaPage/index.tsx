import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowUp, Bot, User, Copy, Check, Swords } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

interface Model {
  id: string;
  name: string;
  vision: boolean;
}

const MODELS: Model[] = [
  { id: 'kimi-k2.5', name: 'kimi-k2.5', vision: true },
  { id: 'kimi-k2.5-lightning', name: 'kimi-k2.5-lightning', vision: true },
  { id: 'glm-5.1', name: 'glm-5.1', vision: false },
  { id: 'glm-5.1-precision', name: 'glm-5.1-precision', vision: false },
  { id: 'glm-5', name: 'glm-5', vision: false },
  { id: 'glm-4.7', name: 'glm-4.7', vision: false },
  { id: 'glm-4.7-flash', name: 'glm-4.7-flash', vision: false },
  { id: 'gemma-4-31b-it', name: 'gemma-4-31b-it', vision: true },
  { id: 'minimax-m2.5', name: 'minimax-m2.5', vision: false },
  { id: 'qwen3.5-397b-a17b', name: 'qwen3.5-397b-a17b', vision: true },
  { id: 'qwen3.5-9b', name: 'qwen3.5-9b', vision: true },
  { id: 'deepseek-v3.2', name: 'deepseek-v3.2', vision: false },
];

interface ArenaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelIndex: number;
}

function ModelDropdown({ selected, onChange }: { selected: string; onChange: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)',
          borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '12px', fontFamily: '"DM Mono", monospace',
        }}
      >
        {selected}
        <ChevronDown size={13} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            width: '200px', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)', borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
          }}
        >
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '8px' }}>
            {MODELS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => { onChange(m.name); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 12px', fontSize: '12px',
                  fontFamily: '"DM Mono", monospace',
                  color: m.name === selected ? 'var(--purple-bright)' : 'var(--text-secondary)',
                  background: m.name === selected ? 'var(--purple-wash)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ChatPanel({ 
  model, setModel, messages, setMessages, input, setInput, sendMessage, isLoading, textareaRef, adjustTextarea, handleKeyDown 
}: {
  model: string;
  setModel: (m: string) => void;
  messages: ArenaMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ArenaMessage[]>>;
  input: string;
  setInput: (v: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  adjustTextarea: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border-subtle)' }}>
      {/* Model selector */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ModelDropdown selected={model} onChange={setModel} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.filter(m => m.modelIndex === 0).length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', fontFamily: '"DM Mono", monospace' }}>
            Start a conversation to compare models
          </div>
        )}
        
        {messages.filter(m => m.modelIndex === 0).map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {msg.role === 'user' ? <User size={14} style={{ color: 'var(--text-secondary)' }} /> : <Bot size={14} style={{ color: 'var(--text-secondary)' }} />}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{msg.role === 'user' ? 'You' : model}</span>
            </div>
            <div style={{
              background: msg.role === 'user' ? 'var(--purple-wash)' : 'var(--surface-hover)',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '10px 14px',
              fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6,
              border: `1px solid ${msg.role === 'user' ? 'var(--purple-glow)' : 'var(--border-subtle)'}`,
              maxWidth: '85%',
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot size={14} style={{ color: 'var(--purple-primary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--purple-primary)' }}>Generating...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '8px 12px' }}>
          <textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={input}
            onChange={e => { setInput(e.target.value); adjustTextarea(); }}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: '13px', color: 'var(--text-primary)', fontFamily: '"Geist", sans-serif' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: input.trim() && !isLoading ? 'var(--purple-primary)' : 'var(--surface-hover)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', opacity: input.trim() ? 1 : 0.4 }}
          >
            <ArrowUp size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

const MOCK_RESPONSE = "This is a simulated response for demonstration purposes. In a real implementation, this would be replaced with actual API calls to the selected model.";

export default function ArenaPage() {
  const [model1, setModel1] = useState(MODELS[0].name);
  const [model2, setModel2] = useState(MODELS[2].name);
  const [messages, setMessages] = useState<ArenaMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef1 = useRef<HTMLTextAreaElement>(null);
  const textareaRef2 = useRef<HTMLTextAreaElement>(null);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ArenaMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date(), modelIndex: -1 };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const assistantMsg1: ArenaMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: MOCK_RESPONSE, timestamp: new Date(), modelIndex: 0 };
    const assistantMsg2: ArenaMessage = { id: (Date.now() + 2).toString(), role: 'assistant', content: MOCK_RESPONSE.replace('demonstration', 'comparison'), timestamp: new Date(), modelIndex: 1 };
    
    setMessages(prev => [...prev, assistantMsg1, assistantMsg2]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <DashboardLayout currentPage="arena">
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 99px; }
      `}</style>
      
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 60px)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Swords size={20} strokeWidth={1.5} style={{ color: 'var(--purple-primary)' }} />
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>ARENA</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: '"DM Mono", monospace', marginLeft: '8px' }}>Compare models side-by-side</span>
        </div>

        {/* Split View */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Panel */}
          <ChatPanel
            model={model1}
            setModel={setModel1}
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            isLoading={isLoading}
            textareaRef={textareaRef1}
            adjustTextarea={adjustTextarea}
            handleKeyDown={handleKeyDown}
          />

          {/* Right Panel */}
          <ChatPanel
            model={model2}
            setModel={setModel2}
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            isLoading={isLoading}
            textareaRef={textareaRef2}
            adjustTextarea={adjustTextarea}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}