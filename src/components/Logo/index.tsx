interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 28, showText = true, className }: LogoProps) {
  return (
    <a 
      href="#/" 
      className={className}
      style={{ 
        textDecoration: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: 'pointer',
      }}
    >
      {/* Logo Icon */}
      <div style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        borderRadius: '7px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg 
          width={size * 0.54} 
          height={size * 0.54} 
          viewBox="0 0 15 15" 
          fill="none"
        >
          <path 
            d="M3 7.5L7 3.5L11 7.5L7 11.5L3 7.5Z" 
            fill="white" 
            fillOpacity="0.95" 
          />
          <path 
            d="M7 3.5L13 7.5L7 11.5" 
            stroke="white" 
            strokeOpacity="0.5" 
            strokeWidth="1.2" 
            fill="none" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: size * 0.72,
          letterSpacing: '0.08em',
          color: '#F4F0FB',
          lineHeight: 1,
        }}>
        CROFAI
        </span>
      )}
    </a>
  );
}