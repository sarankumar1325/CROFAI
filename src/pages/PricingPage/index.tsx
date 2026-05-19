import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import './PricingPage.css';

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
  { id: 'free', name: 'Free', price: 0, cta: 'Switch to Free', features: ['Pay only for usage', 'No recurring charge', 'Access to all models', 'API key included'] },
  { id: 'hobby', name: 'Hobby', price: 5, cta: 'Get Hobby', features: ['500 daily requests', 'Access to all models', 'API key included', 'Standard support'] },
  { id: 'pro', name: 'Pro', price: 10, cta: 'Get Pro', recommended: true, features: ['All Hobby benefits', '1,000 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'intermediate', name: 'Intermediate', price: 20, cta: 'Current plan', current: true, features: ['All Pro benefits', '2,500 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'scale', name: 'Scale', price: 50, cta: 'Get Scale', features: ['All Intermediate benefits', '7,500 daily requests', 'Priority support', 'Access to all models'] },
  { id: 'max', name: 'Max', price: 100, cta: 'Get Max', features: ['All Scale benefits', '15,000 daily requests', 'Dedicated support', 'Access to all models'] },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.article
      className={`pricing-card${plan.current ? ' pricing-card--current' : ''}${plan.recommended ? ' pricing-card--recommended' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut', delay: 0.06 + index * 0.05 }}
    >
      {plan.recommended ? <span className="pricing-badge">Popular</span> : null}
      <div className="pricing-card__head">
        <h3>{plan.name}</h3>
        <div className="pricing-card__price">
          <span>${plan.price}</span>
          <small>/mo</small>
        </div>
      </div>
      <ul>
        {plan.features.map(feature => (
          <li key={feature}>
            <Check size={14} strokeWidth={2.2} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.current ? (
        <div className="pricing-current">Current plan</div>
      ) : (
        <button className={plan.recommended ? 'pricing-button pricing-button--primary' : 'pricing-button'} type="button">
          {plan.cta}
        </button>
      )}
    </motion.article>
  );
}

export default function PricingPage({ currentPage = 'plan' }: { currentPage?: 'plan' | 'dedicated' }) {
  return (
    <DashboardLayout currentPage={currentPage}>
      <div className="pricing-page">
        <motion.header
          className="pricing-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <span>Plans</span>
          <h1>Simple pricing for fast inference.</h1>
          <p>Upgrade or downgrade at any time. Every tier includes access to the full CrofAI model catalog.</p>
        </motion.header>

        <section className="pricing-grid">
          {PLANS.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </section>

        <motion.section
          className="pricing-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.25 }}
        >
          <span className="pricing-status__dot" />
          <p>
            You are on the <strong>Intermediate</strong> plan with <strong>2,500</strong> daily requests.
            Billing resets at midnight UTC.
          </p>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
