import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "error-container": "#ffdad6",
                "primary-fixed-dim": "#b8c4ff",
                "tertiary-fixed": "#dae2fd",
                "on-background": "#0b1c30",
                "error": "#ba1a1a",
                "on-secondary-container": "#6d5200",
                "secondary": "#785a00",
                "on-secondary": "#ffffff",
                "on-primary-fixed": "#001453",
                "surface-bright": "#f8f9ff",
                "on-tertiary-container": "#b4bbd5",
                "surface-container": "#e5eeff",
                "secondary-fixed": "#ffdf9a",
                "primary-fixed": "#dde1ff",
                "primary-container": "#1e40af",
                "background": "#f8f9ff",
                "on-tertiary-fixed-variant": "#3f465c",
                "tertiary": "#2d3449",
                "surface-variant": "#d3e4fe",
                "surface": "#f8f9ff",
                "surface-container-high": "#dce9ff",
                "on-secondary-fixed-variant": "#5a4300",
                "on-primary": "#ffffff",
                "primary": "#00288e",
                "on-surface": "#0b1c30",
                "surface-container-highest": "#d3e4fe",
                "outline-variant": "#c4c5d5",
                "tertiary-container": "#434b60",
                "surface-dim": "#cbdbf5",
                "on-secondary-fixed": "#251a00",
                "on-error-container": "#93000a",
                "inverse-primary": "#b8c4ff",
                "on-error": "#ffffff",
                "surface-tint": "#3755c3",
                "outline": "#757684",
                "tertiary-fixed-dim": "#bec6e0",
                "secondary-fixed-dim": "#f7be1d",
                "on-tertiary": "#ffffff",
                "surface-container-low": "#eff4ff",
                "inverse-surface": "#213145",
                "on-tertiary-fixed": "#131b2e",
                "inverse-on-surface": "#eaf1ff",
                "secondary-container": "#fdc425",
                "on-surface-variant": "#444653",
                "on-primary-fixed-variant": "#173bab",
                "on-primary-container": "#a8b8ff",
                "surface-container-lowest": "#ffffff"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "margin-mobile": "16px",
                "container-max": "1200px",
                "base": "8px",
                "section-gap": "80px",
                "stack-md": "16px",
                "stack-lg": "32px",
                "gutter": "24px",
                "stack-sm": "8px"
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                "label-md": ["Plus Jakarta Sans"],
                "label-sm": ["Plus Jakarta Sans"],
                "display-lg": ["Plus Jakarta Sans"],
                "body-lg": ["Plus Jakarta Sans"],
                "display-lg-mobile": ["Plus Jakarta Sans"],
                "headline-sm": ["Plus Jakarta Sans"],
                "headline-md": ["Plus Jakarta Sans"],
                "body-md": ["Plus Jakarta Sans"]
            },
            fontSize: {
                "label-md": ["14px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
                "label-sm": ["12px", {"lineHeight": "1", "fontWeight": "500"}],
                "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "display-lg-mobile": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "800"}],
                "headline-sm": ["20px", {"lineHeight": "1.4", "fontWeight": "600"}],
                "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "700"}],
                "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}]
            }
        },
    },

    plugins: [forms, require('@tailwindcss/container-queries')],
};
