<template>
  <div>
    <VitePwaManifest />
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
      content: "App para acompanhamento de treinos de musculação",
    },
    { name: "theme-color", content: "#1f2937" },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    },
  ],
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

/* Para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
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
