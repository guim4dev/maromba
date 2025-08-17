export const useSEO = () => {
  // Configurações do site
  const siteConfig = {
    name: "Maromba",
    title: "Maromba - Tracking de Treino",
    description:
      "App para acompanhamento de treinos de musculação. Acompanhe seu progresso, gerencie seus treinos e alcance seus objetivos fitness de forma simples e eficiente.",
    url: "https://maromba.guima.digital",
    image: "https://maromba.guima.digital/og-banner.png", // Substitua pela URL real da sua imagem quando tiver
    author: "Guim4 Tecnologia",
    locale: "pt_BR",
  };

  // Configuração global de SEO
  const getGlobalSEO = () => ({
    title: siteConfig.title,
    meta: [
      {
        name: "description",
        content: siteConfig.description,
      },
      { name: "theme-color", content: "#1f2937" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
      // OpenGraph tags
      { property: "og:type", content: "website" },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:image", content: siteConfig.image },
      { property: "og:image:width", content: "2426" },
      { property: "og:image:height", content: "836" },
      {
        property: "og:image:alt",
        content: `${siteConfig.name} - App de tracking de treino de musculação`,
      },
      { property: "og:url", content: siteConfig.url },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:locale", content: siteConfig.locale },
      // Twitter Card tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.title },
      { name: "twitter:description", content: siteConfig.description },
      { name: "twitter:image", content: siteConfig.image },
      {
        name: "twitter:image:alt",
        content: `${siteConfig.name} - App de tracking de treino de musculação`,
      },
      // Additional meta tags
      { name: "author", content: siteConfig.author },
      {
        name: "keywords",
        content:
          "maromba, treino, musculação, fitness, tracking, progresso, app, pwa",
      },
      { name: "robots", content: "index, follow" },
    ],
  });

  // Configuração específica para páginas
  const getPageSEO = (
    pageConfig: {
      title?: string;
      description?: string;
      image?: string;
      url?: string;
    } = {}
  ) => ({
    title: pageConfig.title || siteConfig.title,
    meta: [
      {
        name: "description",
        content: pageConfig.description || siteConfig.description,
      },
      // OpenGraph específico da página
      { property: "og:type", content: "website" },
      { property: "og:title", content: pageConfig.title || siteConfig.title },
      {
        property: "og:description",
        content: pageConfig.description || siteConfig.description,
      },
      { property: "og:image", content: pageConfig.image || siteConfig.image },
      { property: "og:image:width", content: "2426" },
      { property: "og:image:height", content: "836" },
      {
        property: "og:image:alt",
        content: `${siteConfig.name} - App de tracking de treino de musculação`,
      },
      { property: "og:url", content: pageConfig.url || siteConfig.url },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:locale", content: siteConfig.locale },
      // Twitter Card específico da página
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: pageConfig.title || siteConfig.title },
      {
        name: "twitter:description",
        content: pageConfig.description || siteConfig.description,
      },
      { name: "twitter:image", content: pageConfig.image || siteConfig.image },
      {
        name: "twitter:image:alt",
        content: `${siteConfig.name} - App de tracking de treino de musculação`,
      },
    ],
  });

  return {
    siteConfig,
    getGlobalSEO,
    getPageSEO,
  };
};
