/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          yellow: '#FFF3C7',
          pink: '#FEC7D7',
          blue: '#D2E3C6', // Un verde pastel suave
           lavender: '#E7C6FF',
          peach: '#FEE1E8'
        },
        brand: {
          dark: '#2D3748',
          text: '#4A5568',
          light: '#F7FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}
