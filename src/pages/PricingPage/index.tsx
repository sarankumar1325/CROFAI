import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  cta: string;
  current?: boolean;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  { id: 'free', name: 'Free', price: 0, cta: 'Switch to Free',
    features: ['Pay only for usage', 'No recurring charge', 'Access to all models', 'API key included'] },
  { id: 'hobby', name: 'Hobby', price: 5, cta: 'Get Hobby',
    features: ['500 daily requests', 'Access to all models', 'API key included', 'Standard support'] },
  { id: 'pro', name: 'Pro', price: 10, cta: 'Get Pro', recommended: true,
    features: ['All Hobby benefits', '1,000 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'intermediate', name: 'Intermediate', price: 20, cta: 'Current plan', current: true,
    features: ['All Pro benefits', '2,500 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'scale', name: 'Scale', price: 50, cta: 'Get Scale',
    features: ['All Intermediate benefits', '7,500 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'max', name: 'Max', price: 100, cta: 'Get Max',
    features: ['All Scale benefits', '15,000 daily requests', 'Dedicated support', 'Access to all models'] },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut', delay: 0.06 + index * 0.05 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: plan.current ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${plan.current ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '12px', padding: '22px',
        display: 'flex', flexDirection: 'column', gap: '18px',
        position: 'relative',
        transition: 'transform 150ms, box-shadow 150ms',
        transform: hov && !plan.current ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 4px 12px rgba(139,92,246,0.15)' : '0 1px 2px rgba(0,0,0,0.3)',
      }}
    >
      {plan.recommended && (
        <div style={{
          position: 'absolute', top: '-1px', right: '16px',
          background: '#7C3AED', color: 'white',
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: '0 0 6px 6px',
        }}>
          Popular
        </div>
      )}

      <div>
        <h3 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', letterSpacing: '0.1em', color: '#F4F0FB', marginBottom: '8px', lineHeight: 1 }}>
          {plan.name.toUpperCase()}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{
            fontSize: '28px', fontWeight: 700, color: '#F4F0FB',
            fontFamily: '"DM Mono", monospace', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
          }}>
            ${plan.price}
          </span>
          <span style={{ fontSize: '12px', color: '#5C566A', fontFamily: '"DM Mono", monospace' }}>/mo</span>
        </div>
      </div>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Check size={13} strokeWidth={2.5} style={{ color: '#8B5CF6', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '12px', color: '#8B8598', lineHeight: 1.5, fontFamily: '"DM Mono", monospace' }}>{f}</span>
          </li>
        ))}
      </ul>

      {plan.current ? (
        <div style={{
          textAlign: 'center', padding: '8px 0',
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '6px', fontFamily: '"DM Mono", monospace',
          fontSize: '11px', fontWeight: 500, color: '#A78BFA', letterSpacing: '0.06em',
        }}>
          CURRENT PLAN
        </div>
      ) : (
        <button type="button" style={{
          width: '100%', padding: '9px 0', borderRadius: '8px',
          fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          transition: 'all 150ms',
          background: plan.recommended ? '#7C3AED' : 'rgba(255,255,255,0.05)',
          color: plan.recommended ? 'white' : '#8B8598',
          border: plan.recommended ? 'none' : '1px solid rgba(255,255,255,0.08)',
          letterSpacing: '0.04em',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = plan.recommended ? '#8B5CF6' : 'rgba(255,255,255,0.08)';
            if (!plan.recommended) e.currentTarget.style.color = '#F4F0FB';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = plan.recommended ? '#7C3AED' : 'rgba(255,255,255,0.05)';
            if (!plan.recommended) e.currentTarget.style.color = '#8B8598';
          }}
        >
          {plan.cta}
        </button>
      )}
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <DashboardLayout currentPage="plan">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ marginBottom: '36px' }}
        >
          <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '42px', letterSpacing: '0.08em', color: '#F4F0FB', lineHeight: 1 }}>
            PLANS
          </h1>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#5C566A', marginTop: '8px', letterSpacing: '0.02em' }}>
            Upgrade or downgrade at any time. All plans include access to every model.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '14px',
        }}
          className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.25 }}
          style={{
            marginTop: '40px', padding: '18px 22px',
            background: '#13111C', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', flexShrink: 0, boxShadow: '0 0 0 3px rgba(52,211,153,0.2)' }} />
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '12px', color: '#8B8598', letterSpacing: '0.01em' }}>
            You are on the{' '}
            <span style={{ color: '#A78BFA' }}>Intermediate</span> plan with{' '}
            <span style={{ color: '#F4F0FB' }}>2,500</span> daily requests. Billing resets at midnight UTC.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
