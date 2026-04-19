import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage/Index';
import DocsPage from './pages/DocsPage/Index';

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  // Listen for native browser hash changes
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Automatically scroll to elements when the hash path changes (e.g. #/docs/python-basic -> looks for id="python-basic")
  useEffect(() => {
    const parts = hash.split('/');
    const targetId = parts[parts.length - 1]; // e.g. "pricing" from "#/pricing" or "python-basic" from "#/docs/python-basic"
    
    if (targetId && targetId !== '' && targetId !== 'docs') {
      // Small timeout to ensure the new page components have mounted before scrolling
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  // Routing Logic
  if (hash.startsWith('#/docs')) return <DocsPage />;
  return <LandingPage />;
}

export default App;