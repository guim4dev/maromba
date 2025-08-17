// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Desligar SSR para PWA
  ssr: false,

  routeRules: {
    // prerender index route by default
    "/": { prerender: true },
  },

  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      registerPlugin: true,
    },
    manifest: {
      name: "Maromba - Tracking de Treino",
      short_name: "Maromba",
      description: "App para acompanhamento de treinos de musculação",
      theme_color: "#1f2937",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      id: "/",
      icons: [
        {
          src: "favicon.ico",
          sizes: "48x48",
          type: "image/x-icon",
        },
        {
          src: "icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "screenshot-desktop.png",
          sizes: "2560x1440",
          type: "image/png",
          form_factor: "wide",
        },
        {
          src: "screenshot-mobile.png",
          sizes: "827x1791",
          type: "image/png",
          form_factor: "narrow",
        },
      ],
    },
  },
});
