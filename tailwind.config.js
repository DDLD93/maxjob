/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#E6F8F9',
          100: '#CCEEF0',
          200: '#99DEDF',
          300: '#66CDCF',
          400: '#44C1C4',
          500: '#29ADB2',
          600: '#21888C',
          700: '#196366',
          800: '#103E40',
          900: '#081F20',
          950: '#040F10',
        },
        'secondary': {
          50: '#E1EDF6',
          100: '#C3DBEE',
          200: '#87B7DD',
          300: '#4B93CC',
          400: '#2578BB',
          500: '#0766AD',
          600: '#065491',
          700: '#043F6B',
          800: '#032A46',
          900: '#011523',
          950: '#000A11',
        },
        'bg': '#F3F3F3',
        'accent': {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        'success': {
          500: '#29ADB2',
          600: '#21888C',
        },
        'warning': {
          500: '#F59E0B',
          600: '#D97706',
        },
        'error': {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};