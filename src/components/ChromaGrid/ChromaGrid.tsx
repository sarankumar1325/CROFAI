import { useRef, useEffect, useState } from 'react';
import './ChromaGrid.css';

export interface ChromaGridItem {
  title: string;
  subtitle: string;
  url?: string;
}

interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
}

// SVG Icon Components
const LightningIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 4L16 32H28L24 60L44 32H32L36 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M20 20L24 28" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M44 20L40 28" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

const PuzzleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 20C24 16.6863 26.6863 14 30 14H34C37.3137 14 40 16.6863 40 20V22C40 22.5523 40.4477 23 41 23C41.5523 23 42 22.5523 42 22V20C42 15.5817 38.4183 12 34 12H30C25.5817 12 22 15.5817 22 20V22C22 22.5523 22.4477 23 23 23C23.5523 23 24 22.5523 24 22V20Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M24 44C24 40.6863 26.6863 38 30 38H34C37.3137 38 40 40.6863 40 44V46C40 46.5523 40.4477 47 41 47C41.5523 47 42 46.5523 42 46V44C42 39.5817 38.4183 36 34 36H30C25.5817 36 22 39.5817 22 44V46C22 46.5523 22.4477 47 23 47C23.5523 47 24 46.5523 24 46V44Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 28V32" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 32C32 33.1046 32.8954 34 34 34C35.1046 34 36 33.1046 36 32C36 30.8954 35.1046 30 34 30C32.8954 30 32 30.8954 32 32Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 32C32 33.1046 31.1046 34 30 34C28.8954 34 28 33.1046 28 32C28 30.8954 28.8954 30 30 30C31.1046 30 32 30.8954 32 32Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
  </svg>
);

const CoinIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="14" stroke="white" strokeWidth="1.5"/>
    <path d="M32 22V20" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 44V42" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M22 32H20" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M44 32H42" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M26 26L24 24" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M38 38L36 36" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M38 26L36 24" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M26 38L24 36" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 50L30 48" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M34 50L32 48" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 48L30 46" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 48L34 46" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12L18 18V32C18 42 24 50 32 54C40 50 46 42 46 32V18L32 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M28 32C28 30.8954 28.8954 30 30 30H34C35.1046 30 36 30.8954 36 32V36C36 37.1046 35.1046 38 34 38H30C28.8954 38 28 37.1046 28 36V32Z" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 24V28" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12C32 12 40 20 40 32C40 38 38 42 38 42" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 12C32 12 24 20 24 32C24 38 26 42 26 42" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M32 12V42" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M28 42H36" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M28 50L26 54" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M36 50L38 54" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M32 46L32 50" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M24 28C22 26 20 24 20 24" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M40 28C42 26 44 24 44 24" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 48V36" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M28 48V28" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M40 48V20" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M52 48V12" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M16 36L28 28L40 20L52 12" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"/>
    <path d="M14 50H54" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M50 10L54 8" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M52 12L56 10" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
  </svg>
);

const icons = [
  <LightningIcon key="latency" />,
  <PuzzleIcon key="integration" />,
  <CoinIcon key="cost" />,
  <ShieldIcon key="secure" />,
  <RocketIcon key="deployment" />,
  <ChartIcon key="analytics" />
];

export const ChromaGrid = ({
  items,
  className = ''
}: ChromaGridProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={gridRef}
      className={`chroma-grid ${className}`}
    >
      {items.map((item, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener,noreferrer')}
          style={{
            cursor: item.url ? 'pointer' : 'default',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s ease ${i * 100}ms`
          } as React.CSSProperties}
        >
          <div className="chroma-icon-wrapper">
            <div className="chroma-icon">{icons[i]}</div>
          </div>
          <footer className="chroma-info">
            <h3 className="name">{item.title}</h3>
          </footer>
        </article>
      ))}
    </div>
  );
};

export default ChromaGrid;
