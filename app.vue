<template>
  <div>
    <VitePwaManifest />
    <PWAInstallPrompt />
    <NuxtPage />
  </div>
</template>

<script setup>
// Configuração global do app
useHead({
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
    { property: "og:type", content: "website" }, // "website" is standard; "pwa" or "application" are not valid OpenGraph types
    { property: "og:title", content: "Maromba - Tracking de Treino" },
    {
      property: "og:description",
      content:
        "App para acompanhamento de treinos de musculação. Acompanhe seu progresso, gerencie seus treinos e alcance seus objetivos fitness de forma simples e eficiente.",
    },
    {
      property: "og:image",
      content: "https://maromba.guima.digital/og-banner.png",
    }, // Substitua pela URL real da sua imagem quando tiver
    { property: "og:image:width", content: "2426" },
    { property: "og:image:height", content: "171" },
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
});

// Inicializar dark mode
const { loadTheme } = useDarkMode();
onMounted(() => {
  loadTheme();
});
</script>

<style>
/* Estilos globais */
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Estilização minimalista do scroll */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.dark * {
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* Melhorar experiência mobile */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
  }

  /* Scroll mais discreto em mobile */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}
</style>
