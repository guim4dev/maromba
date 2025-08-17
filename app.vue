<template>
  <div>
    <VitePwaManifest />
    <PWAInstallPrompt />
    <NuxtPage />
  </div>
</template>

<script setup>
// Configuração global do app - SEO já está no nuxt.config.ts
useHead({
  title: "Maromba - Tracking de Treino",
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
