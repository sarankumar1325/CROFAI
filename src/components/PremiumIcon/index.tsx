import { motion } from 'framer-motion';

const COLORS = {
  purple: {
    primary: '#7c3aed',
    bright: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    dark: '#4c1d95',
  },
  text: {
    primary: '#F4F0FB',
  }
};

export default function PremiumIcon() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
      style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.purple.bright} stopOpacity="0.8" />
            <stop offset="50%" stopColor={COLORS.purple.primary} />
            <stop offset="100%" stopColor={COLORS.purple.dark} />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer decorative ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke={COLORS.purple.primary}
          strokeWidth="1"
          opacity="0.3"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner decorative ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke={COLORS.purple.bright}
          strokeWidth="0.5"
          opacity="0.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Core hexagon - representing AI/neural network */}
        <motion.g
          filter="url(#glow)"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polygon
            points="40,22 54,31 54,49 40,58 26,49 26,31"
            fill="none"
            stroke={COLORS.purple.bright}
            strokeWidth="1.5"
          />
        </motion.g>
        
        {/* Inner neural nodes */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Center node */}
          <circle cx="40" cy="40" r="4" fill={COLORS.purple.bright} />
          
          {/* Orbiting nodes with pulse */}
          <motion.circle
            cx="40"
            cy="28"
            r="2.5"
            fill={COLORS.purple.primary}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="52"
            cy="40"
            r="2.5"
            fill={COLORS.purple.primary}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.circle
            cx="40"
            cy="52"
            r="2.5"
            fill={COLORS.purple.primary}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="28"
            cy="40"
            r="2.5"
            fill={COLORS.purple.primary}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          />
        </motion.g>
        
        {/* Connection lines with animation */}
        <motion.line
          x1="40" y1="40" x2="40" y2="28"
          stroke={COLORS.purple.primary}
          strokeWidth="0.8"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="40" y1="40" x2="52" y2="40"
          stroke={COLORS.purple.primary}
          strokeWidth="0.8"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.line
          x1="40" y1="40" x2="40" y2="52"
          stroke={COLORS.purple.primary}
          strokeWidth="0.8"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.line
          x1="40" y1="40" x2="28" y2="40"
          stroke={COLORS.purple.primary}
          strokeWidth="0.8"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </svg>
      
      {/* Subtle outer glow overlay */}
      <motion.div
        animate={{ 
          boxShadow: [
            `0 0 20px ${COLORS.purple.glow}`,
            `0 0 35px ${COLORS.purple.glow}`,
            `0 0 20px ${COLORS.purple.glow}`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'transparent',
        }}
      />
    </motion.div>
  );
}