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
                sans: ['var(--font-dm-sans)', 'sans-serif'],
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
            "toast-in": {
                "0%": { transform: "translateX(100%)", opacity: "0" },
                "100%": { transform: "translateX(0)", opacity: "1" },
            },
        },
        animation: {
            scroll: "scroll 60s linear infinite",
            "toast-in": "toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
