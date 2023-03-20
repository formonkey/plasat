const colors = require('tailwindcss/colors');
const customColors = require('./src/tailwind.colors.json');

module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        fontFamily: {
            'sans': ['Manrope', 'Arial', 'sans-serif'],
        },
        extend: {
        },

        colors: {
            ...customColors,
            ...colors,
            gray: {
                ...colors.gray,
                ...customColors.gray
            },
            black: {
                ...colors.black,
                ...customColors.black
            }
        }
    },
    plugins: [require('flowbite/plugin'), require('@tailwindcss/forms')]
};
