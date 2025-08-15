import path from 'path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const APP_BASE = process.env.VITE_APP_BASE ?? '/';

// https://vite.dev/config/
export default defineConfig({
    base: APP_BASE,
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@UI': path.resolve(__dirname, '/src/components/UI/index.ts')
        }
    },
    server: {
        port: 8080,
        host: true
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version)
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "@/styles/_mixins.scss" as *;
                `
            }
        }
    }
});
