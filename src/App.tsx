import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage/Index';
import DocsPage from './pages/DocsPage/Index';
import DashboardPage from './pages/DashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';

const DASHBOARD_ROUTES = ['#/dashboard', '#/playground', '#/plan', '#/dedicated', '#/settings'];

function isDashboardRoute(hash: string) {
  return DASHBOARD_ROUTES.some(r => hash.startsWith(r));
}

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isDashboardRoute(hash) || hash.startsWith('#/docs')) {
      window.scrollTo({ top: 0 });
      return;
    }
    const parts = hash.split('/');
    const targetId = parts[parts.length - 1];
    if (targetId && targetId !== '' && targetId !== 'docs') {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  if (hash.startsWith('#/docs')) return <DocsPage />;
  if (hash.startsWith('#/dashboard')) return <DashboardPage />;
  if (hash.startsWith('#/playground')) return <PlaygroundPage />;
  if (hash.startsWith('#/plan')) return <PricingPage />;
  if (hash.startsWith('#/dedicated')) return <PricingPage currentPage="dedicated" />;
  if (hash.startsWith('#/settings')) return <SettingsPage />;
  return <LandingPage />;
}

export default App;
