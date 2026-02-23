import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        tailwindcss(),
        vue(),
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
    ],
    server: {
        host: "0.0.0.0", // 👈 allow Vite to be accessed from outside the container
        port: 5173, // 👈 match your docker-compose.yml port mapping
        strictPort: true, // ensures the port is exactly 5173
        hmr: {
            host: "127.0.0.1", // 👈 needed so browser connects to your host machine correctly
        },
        watch: {
            usePolling: true, // 👈 ensures live reload works reliably inside Docker
        },
    },
});
