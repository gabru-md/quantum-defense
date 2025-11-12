import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080,
        allowedHosts: [
            '6001163615d6.ngrok-free.app',
            'cb60a10a2deb.ngrok-free.app',
            '6e8f650592eb.ngrok-free.app',
            '90cdcf2edc33.ngrok-free.app'
        ]
    }
});
