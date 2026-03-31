import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const ROOT = path.resolve('');
const BASE = __dirname.replace(ROOT, '');

/**
 * Custom PostCSS plugin to scope global CSS selectors under .beyondseo
 * This prevents plugin CSS from affecting WordPress admin elements.
 */
function beyondseoScopePlugin() {
    return {
        postcssPlugin: 'beyondseo-scope',
        Rule(rule) {
            // Skip rules inside @keyframes
            if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') {
                return;
            }
            // Skip CSS module selectors (already scoped by hash)
            if (rule.selector && rule.selector.includes('___')) {
                return;
            }
            // Skip selectors already scoped to plugin containers
            if (rule.selector && (
                rule.selector.includes('.beyondseo') ||
                rule.selector.includes('#edit-rankingcoach') ||
                rule.selector.includes('#seo-optimiser-rankingcoach') ||
                rule.selector.includes('#onboarding-rankingcoach') ||
                rule.selector.includes('#registration-rankingcoach') ||
                rule.selector.includes('#generalSettings-rankingcoach') ||
                rule.selector.includes('#upsell-rankingcoach') ||
                rule.selector.includes('#rankingcoach-') ||
                rule.selector.includes('#rc-') ||
                rule.selector.includes('.vanguard-')
            )) {
                return;
            }

            // Scope all selectors that don't start with a class or ID
            const selectors = rule.selector.split(',').map(s => s.trim());
            const needsScoping = selectors.some(s => {
                // Bare element selectors (div, span, body, html, a, p, h1, etc.)
                if (/^[a-zA-Z]/.test(s)) return true;
                // Universal selector
                if (s === '*' || /^\*[:\s]/.test(s)) return true;
                // Pseudo-root
                if (s === ':root' || s.startsWith(':root')) return true;
                // Pseudo-elements at top level
                if (/^::?(?:after|before|first-line|first-letter)/.test(s)) return true;
                // Attribute selectors at top level
                if (/^\[/.test(s)) return true;
                return false;
            });

            if (needsScoping) {
                rule.selector = selectors.map(s => {
                    s = s.trim();
                    if (s === ':root' || s === 'body' || s === 'html') return '.beyondseo';
                    if (s === '*') return '.beyondseo *';
                    if (/^::?(?:after|before)/.test(s)) return '.beyondseo *' + s;
                    return '.beyondseo ' + s;
                }).join(', ');
            }
        }
    };
}
beyondseoScopePlugin.postcss = true;

export default defineConfig({
    base: process.env.NODE_ENV === 'production'
        ? '/wp-content/plugins/beyondseo/react/dist/'
        : '/',
    plugins: [
        react()
    ],
    css: {
        modules: {
            localsConvention: "camelCase",
            generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
        postcss: {
            plugins: [beyondseoScopePlugin()],
        },
    },
    build: {
        minify: process.env.BUILD_TYPE === 'production',
        sourcemap: process.env.BUILD_TYPE === 'staging',
        assetsDir: 'assets',
        outDir: 'dist', // Output directory for all build files
        emptyOutDir: true, // Clears the dist folder before each build
        manifest: 'manifest.json', // Enable manifest.json generation
        watch: process.env.NODE_ENV !== 'production' ? {
            include: ['src/**'],
            exclude: ['node_modules/**', 'dist/**']
        } : null,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/main.tsx'),
                app: path.resolve(__dirname, 'src/App.tsx'),
                styles: path.resolve(__dirname, 'src/App.css')
            },
            output: {
                entryFileNames: '[name].[hash].js',
                chunkFileNames: '[name].[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            }
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
            "@src": path.resolve(__dirname, "./src"),
            "@models": path.resolve(__dirname, "./src/models"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@stores": path.resolve(__dirname, "./src/stores"),
            "@helpers": path.resolve(__dirname, "./src/helpers"),
            "@hooks": path.resolve(__dirname, "./src/custom-hooks"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@contexts": path.resolve(__dirname, "./src/contexts"),
            "@vanguard-style": path.resolve(__dirname, "node_modules/@rankingcoach/vanguard/dist/vanguard.css"),
            "vanguard": "@rankingcoach/vanguard",
        },
    },
});
