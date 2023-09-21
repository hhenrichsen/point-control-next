import type {Config} from "tailwindcss";

export default {
    content: ["../../packages/ui/components/**/*.{js,jsx,ts,tsx}", "../../apps/web/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;