/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#16213A', light: '#232F4E', muted: '#4A5578' },
        canvas: { DEFAULT: '#F6F7F5', dim: '#EDEFEA', dark: '#0F1626', darkDim: '#161F33' },
        clay: { 50: '#FBEEEC', 100: '#F5D9D5', 300: '#E3A69D', 500: '#B85C6D', 600: '#A14D5E', 700: '#833E4C' },
        teal: { 50: '#E8F3F2', 100: '#C7E3E0', 300: '#6FADA8', 500: '#1F6F6B', 600: '#175A57', 700: '#124542' },
        lavender: { 100: '#E9E7F7', 300: '#B8B1E0', 500: '#8B85C1', 700: '#655EA0' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(22, 33, 58, 0.10)',
        softLg: '0 12px 40px -8px rgba(22, 33, 58, 0.16)',
        glass: '0 8px 32px 0 rgba(22, 33, 58, 0.12)',
        glowClay: '0 10px 34px -6px rgba(184, 92, 109, 0.45)',
        glowTeal: '0 10px 34px -6px rgba(31, 111, 107, 0.4)',
        glowLavender: '0 10px 34px -6px rgba(139, 133, 193, 0.4)',
        cardHover: '0 20px 48px -12px rgba(22, 33, 58, 0.22)',
        floatPanel: '0 24px 64px -12px rgba(22, 33, 58, 0.35)',
      },
      backgroundImage: {
        'dawn-gradient': 'linear-gradient(135deg, #FBEEEC 0%, #E9E7F7 50%, #E8F3F2 100%)',
        'dawn-gradient-dark': 'linear-gradient(135deg, #161F33 0%, #1B2340 50%, #12312F 100%)',
        'mesh-light':
          'radial-gradient(at 15% 10%, rgba(184,92,109,0.07) 0px, transparent 50%), radial-gradient(at 85% 20%, rgba(139,133,193,0.08) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(31,111,107,0.06) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 15% 10%, rgba(184,92,109,0.10) 0px, transparent 50%), radial-gradient(at 85% 20%, rgba(139,133,193,0.10) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(31,111,107,0.12) 0px, transparent 50%)',
        'hero-radial': 'radial-gradient(circle at 30% 20%, rgba(139,133,193,0.35), transparent 55%), radial-gradient(circle at 75% 75%, rgba(184,92,109,0.30), transparent 55%), radial-gradient(circle at 20% 85%, rgba(31,111,107,0.25), transparent 50%)',
      },
      keyframes: {
        scanSweep: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(1.5deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        barGrow: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width, 60%)' },
        },
      },
      animation: {
        scanSweep: 'scanSweep 2.4s ease-in-out infinite',
        floatY: 'floatY 6s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        pulseRing: 'pulseRing 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        barGrow: 'barGrow 1.2s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
