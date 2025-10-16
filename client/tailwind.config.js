// import { addDynamicIconSelectors } from '@iconify/tailwind';
import defaultTheme from "tailwindcss/defaultTheme";

// import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

const tailwindConfig = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern':
          "url('/Users/jeevan/copy/Rent a drive/client/src/pages/admin/data/welcome-bg.svg')",
      }
    },
  },
  plugins: [
    // addDynamicIconSelectors(),
    // addVariablesForColors // Assuming addVariablesForColors is defined somewhere in your code
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// function addVariablesForColors({ addBase, theme }) {
//   let allColors = flattenColorPalette(theme("colors"));
//   let newVars = Object.fromEntries(
//     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
//   );

//   addBase({
//     ":root": newVars,
//   });
// }

const combinedConfig = {
  ...defaultTheme, // Merge defaultTheme
  ...tailwindConfig // Merge tailwindConfig
};

export default combinedConfig;
