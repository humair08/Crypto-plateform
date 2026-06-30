import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#050505',
        background: '#050505',
        secondary: '#101010',
        tertiary: '#161616',
        border: '#252525',
        accent: '#00E0FF',
        'accent-secondary': '#8A5CFF',
        success: '#00D26A',
        warning: '#FFB800',
        danger: '#FF4D4F',
      },
      backgroundColor: {
        primary: '#050505',
        secondary: '#101010',
        tertiary: '#161616',
      },
      borderColor: {
        default: '#252525',
      },
      textColor: {
        accent: '#00E0FF',
        'accent-secondary': '#8A5CFF',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 224, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(138, 92, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(0, 224, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        glass: '10px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 224, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 224, 255, 0.6)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
