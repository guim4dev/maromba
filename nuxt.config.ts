// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Desligar SSR para PWA
  ssr: false,

  routeRules: {
    // prerender index route by default
    "/": { prerender: true },
  },

  // Configuração do template de loading para SPA
  app: {
    // Template HTML padrão com SEO e OpenGraph
    baseURL: "/",
    head: {
      title: "Maromba - Tracking de Treino",
      meta: [
        {
          name: "description",
          content:
            "App para acompanhamento de treinos de musculação. Acompanhe seu progresso, gerencie seus treinos e alcance seus objetivos fitness de forma simples e eficiente.",
        },
        { name: "theme-color", content: "#1f2937" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
        // OpenGraph tags
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Maromba - Tracking de Treino" },
        {
          property: "og:description",
          content:
            "App para acompanhamento de treinos de musculação. Acompanhe seu progresso, gerencie seus treinos e alcance seus objetivos fitness de forma simples e eficiente.",
        },
        {
          property: "og:image",
          content: "https://maromba.guima.digital/og-banner.png",
        },
        { property: "og:image:width", content: "2400" },
        { property: "og:image:height", content: "1260" },
        {
          property: "og:image:alt",
          content: "Maromba - App de tracking de treino de musculação",
        },
        { property: "og:url", content: "https://maromba.guima.digital" },
        { property: "og:site_name", content: "Maromba" },
        { property: "og:locale", content: "pt_BR" },
        // Twitter Card tags
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Maromba - Tracking de Treino" },
        {
          name: "twitter:description",
          content:
            "App para acompanhamento de treinos de musculação. Acompanhe seu progresso, gerencie seus treinos e alcance seus objetivos fitness de forma simples e eficiente.",
        },
        {
          name: "twitter:image",
          content: "https://maromba.guima.digital/og-banner.png",
        },
        {
          name: "twitter:image:alt",
          content: "Maromba - App de tracking de treino de musculação",
        },
        // Additional meta tags
        { name: "author", content: "Guim4 Tecnologia" },
        {
          name: "keywords",
          content:
            "maromba, treino, musculação, fitness, tracking, progresso, app, pwa",
        },
        { name: "robots", content: "index, follow" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "192x192",
          href: "/icon-192x192.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "512x512",
          href: "/icon-512x512.png",
        },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
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
