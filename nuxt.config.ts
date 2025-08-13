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
      icons: [
        {
          src: "favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon",
        },
      ],
    },
  },
});
