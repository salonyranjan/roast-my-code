/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        char: '#0B0B0C',
        steel: '#1C1C1E',
        steel2: '#232326',
        ticket: '#F2EDE4',
        ticketDim: '#E3DCCC',
        scorch: '#FF4D2E',
        scorchDim: '#C93D22',
        brass: '#C9A227',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(3) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(0.95) rotate(-8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        print: {
          '0%': { clipPath: 'inset(0 0 100% 0)' },
          '100%': { clipPath: 'inset(0 0 0% 0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
        },
      },
      animation: {
        stamp: 'stamp 0.4s cubic-bezier(.2,1.5,.4,1) forwards',
        print: 'print 0.9s steps(24) forwards',
        flicker: 'flicker 4s infinite',
      },
    },
  },
  plugins: [],
};
