import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const ROOT = path.resolve('');
const BASE = __dirname.replace(ROOT, '');

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
            plugins: [],
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
