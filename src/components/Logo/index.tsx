import logoImage from '../../../assets/logonahcrof.jpg';

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
      <img
        src={logoImage}
        alt=""
        style={{
        width: size,
        height: size,
        borderRadius: '7px',
        objectFit: 'cover',
        border: '1px solid var(--border-subtle)',
        flexShrink: 0,
        }}
      />
      
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
