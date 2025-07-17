/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // X-style color palette
        'bg-primary': '#000000',
        'bg-secondary': '#16181c',
        'bg-tertiary': '#202327',
        'bg-hover': '#1d1f23',
        'border-primary': '#2f3336',
        'border-secondary': '#3e4144',
        'text-primary': '#e7e9ea',
        'text-secondary': '#71767b',
        'text-tertiary': '#8b8d91',
        'accent-blue': '#1d9bf0',
        'accent-blue-hover': '#1a8cd8',
        'accent-blue-dark': '#1570a6',
        'success': '#00ba7c',
        'warning': '#ffd400',
        'error': '#f4212e',
      },
      animation: {
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'bounce-custom': 'bounce 0.8s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        slideInUp: {
          from: {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInRight: {
          from: {
            transform: 'translateX(20px)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            transform: 'translate3d(0, -8px, 0)',
          },
          '70%': {
            transform: 'translate3d(0, -4px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};