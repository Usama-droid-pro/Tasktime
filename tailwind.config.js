/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Excel Color Palette
        excel: {
          // Primary Excel colors
          blue: {
            50: '#E6F2FF',
            100: '#CCE5FF',
            200: '#99CCFF',
            300: '#66B2FF',
            400: '#3399FF',
            500: '#217346', // New primary color
            600: '#1E5F3E',
            700: '#1B4B36',
            800: '#18372E',
            900: '#152326',
          },
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
          // Excel-specific colors
          header: '#217346', // Excel header blue
          border: '#D0D7DE',
          hover: '#E1E5E9',
          selected: '#0078D4',
          background: '#FFFFFF',
          sidebar: '#F8F9FA',
          text: {
            primary: '#323130',
            secondary: '#605E5C',
            muted: '#8A8886',
          }
        }
      },
      fontFamily: {
        // Excel-like fonts
        'excel': ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        'mono': ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'excel-xs': ['13px', '16px'],
        'excel-sm': ['14px', '18px'],
        'excel-base': ['16px', '22px'],
        'excel-lg': ['18px', '26px'],
        'excel-xl': ['20px', '30px'],
        'excel-2xl': ['24px', '32px'],
      },
      spacing: {
        'excel-xs': '4px',
        'excel-sm': '8px',
        'excel-md': '12px',
        'excel-lg': '16px',
        'excel-xl': '20px',
        'excel-2xl': '28px',
        'excel-3xl': '36px',
      },
      boxShadow: {
        'excel': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'excel-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'excel': '2px',
        'excel-sm': '1px',
      }
    },
  },
  plugins: [],
}
