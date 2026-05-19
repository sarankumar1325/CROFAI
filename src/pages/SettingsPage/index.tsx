import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CreditCard, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useTheme } from '../../contexts/ThemeContext';
import './SettingsPage.css';

const CREDIT_AMOUNTS = [10, 25, 50, 100];

function SettingsCard({ title, description, children, delay = 0 }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      className="settings-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut', delay }}
    >
      <div className="settings-card__header">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ type = 'text', placeholder, value, onChange }: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="settings-input">
      <input
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
      {isPassword ? (
        <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
          {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
        </button>
      ) : null}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [billingEmail, setBillingEmail] = useState('sarankumar131313@gmail.com');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [selectedAmt, setSelectedAmt] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isDark = theme === 'dark';

  return (
    <DashboardLayout currentPage="settings">
      <div className="settings-page">
        <motion.header
          className="settings-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <span>Workspace</span>
          <h1>Settings</h1>
          <p>Manage account security, billing preferences, and interface defaults.</p>
        </motion.header>

        <div className="settings-stack">
          <SettingsCard title="Account Information" description="Update contact details used for billing and account notices." delay={0.04}>
            <div className="settings-identity">
              <span>Signed in as</span>
              <strong>sarankumar131313@gmail.com</strong>
            </div>
            <Field label="Billing email">
              <TextInput placeholder="billing@example.com" value={billingEmail} onChange={setBillingEmail} />
            </Field>
            <div className="settings-actions">
              <button className="settings-primary" type="button">Update email</button>
            </div>
          </SettingsCard>

          <SettingsCard title="Security" description="Use a strong password to protect API keys and billing access." delay={0.08}>
            <Field label="Current password">
              <TextInput type="password" placeholder="Enter current password" value={currentPw} onChange={setCurrentPw} />
            </Field>
            <Field label="New password">
              <TextInput type="password" placeholder="Enter new password" value={newPw} onChange={setNewPw} />
            </Field>
            <Field label="Confirm new password">
              <TextInput type="password" placeholder="Confirm new password" value={confirmPw} onChange={setConfirmPw} />
            </Field>
            {newPw && confirmPw && newPw !== confirmPw ? <p className="settings-error">Passwords do not match.</p> : null}
            <div className="settings-actions">
              <button className="settings-primary" type="button">Update password</button>
            </div>
          </SettingsCard>

          <SettingsCard title="Preferences" description="Choose the interface theme used across the dashboard." delay={0.12}>
            <button className="settings-theme" type="button" onClick={toggleTheme}>
              <span className="settings-theme__icon">{isDark ? <Moon size={18} /> : <Sun size={18} />}</span>
              <span>
                <strong>{isDark ? 'Dark mode' : 'Light mode'}</strong>
                <small>{isDark ? 'Currently using dark theme' : 'Currently using light theme'}</small>
              </span>
              <i className={isDark ? 'settings-switch settings-switch--on' : 'settings-switch'}><b /></i>
            </button>
          </SettingsCard>

          <SettingsCard title="Billing" description="Review balance, add credits, and manage payment methods." delay={0.16}>
            <div className="settings-balance">
              <span>Current balance</span>
              <strong>$-0.000</strong>
            </div>
            <div className="settings-credit-grid">
              {CREDIT_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  className={selectedAmt === amount ? 'settings-credit settings-credit--active' : 'settings-credit'}
                  type="button"
                  onClick={() => setSelectedAmt(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="settings-actions settings-actions--split">
              <button className="settings-primary" type="button">Add credits</button>
              <button className="settings-secondary" type="button"><CreditCard size={15} />Manage payment</button>
            </div>
            <p className="settings-help">Minimum $2. Credits are added instantly after payment.</p>
          </SettingsCard>

          <motion.section
            className="settings-danger"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="settings-danger__title">
              <AlertTriangle size={17} />
              <h2>Danger Zone</h2>
            </div>
            <p>This action is irreversible. All API keys, usage data, and account information will be permanently deleted.</p>
            {!deleteConfirm ? (
              <button className="settings-danger__button" type="button" onClick={() => setDeleteConfirm(true)}>Delete account</button>
            ) : (
              <div className="settings-confirm">
                <strong>Are you sure? This cannot be undone.</strong>
                <div>
                  <button className="settings-danger__button settings-danger__button--solid" type="button">Yes, delete my account</button>
                  <button className="settings-secondary" type="button" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </DashboardLayout>
  );
}
