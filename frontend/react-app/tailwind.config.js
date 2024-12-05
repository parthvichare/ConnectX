/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customColor: 'rgba(255, 234, 223, 1)',
      },
      screens: {
        's': '320px',    // Small phones
        'm': '375px',    // Medium phones
        'l': '425px',    // Large phones
        'tablet': '768px', // Smaller tablets
        'ipad-air': '820px', // iPad Air
        'laptop': '1024px',  // Smaller laptops
        'laptop-l': '1440px' // Larger laptops
      },      
      fontSize: {
        'xxs': '0.720rem', // 10px
        'xx' : '0.876rem',
        'ss':'0.709rem',
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',    // 16px
      },
      fontFamily: {
        'custom-serif': ['Source Serif Pro', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  variants: {},
  plugins: [],
}