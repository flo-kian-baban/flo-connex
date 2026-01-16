import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#FF4D22",
                    hover: "#E63E15",
                    light: "#FFEDEA",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            borderRadius: {
                '3xl': '1.5rem',
            }
        },
        keyframes: {
            scroll: {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-100%)" },
            },
        },
        animation: {
            scroll: "scroll 60s linear infinite",
        },
    },
    plugins: [],
};
export default config;
