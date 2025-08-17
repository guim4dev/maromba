# SEO e OpenGraph - Maromba

## Estrutura Implementada

### 1. Configuração Centralizada (`nuxt.config.ts`)

Todas as meta tags de SEO e OpenGraph estão configuradas no `nuxt.config.ts` usando `app.head`. Isso garante que sejam carregadas imediatamente e de forma centralizada.

#### Meta Tags Incluídas:

**SEO Básico:**

- `title` - Título da página
- `description` - Descrição do app
- `author` - Autor (Guim4 Tecnologia)
- `keywords` - Palavras-chave para SEO
- `robots` - Instruções para crawlers

**OpenGraph (Facebook, LinkedIn, WhatsApp):**

- `og:type` - Tipo de conteúdo (website)
- `og:title` - Título para compartilhamento
- `og:description` - Descrição para compartilhamento
- `og:image` - URL da imagem banner
- `og:image:width` e `og:image:height` - Dimensões da imagem
- `og:image:alt` - Texto alternativo para acessibilidade
- `og:url` - URL do site
- `og:site_name` - Nome do site
- `og:locale` - Localização (pt_BR)

**Twitter Cards:**

- `twitter:card` - Tipo de card (summary_large_image)
- `twitter:title` - Título para Twitter
- `twitter:description` - Descrição para Twitter
- `twitter:image` - URL da imagem
- `twitter:image:alt` - Texto alternativo

### 2. Configurações Centralizadas (`composables/useSEO.ts`)

Composable para gerenciar configurações de SEO de forma centralizada:

```typescript
const siteConfig = {
  name: "Maromba",
  title: "Maromba - Tracking de Treino",
  description: "App para acompanhamento de treinos...",
  url: "https://maromba.guima.digital",
  image: "https://maromba.guima.digital/og-banner.png",
  author: "Guim4 Tecnologia",
  locale: "pt_BR",
};
```

### 3. Loading Screen Personalizada

O template inclui uma tela de loading bonita com:

- Logo animado (💪)
- Título e subtítulo
- Spinner de carregamento
- Gradiente de fundo
- Responsividade para mobile

## Vantagens desta Abordagem

### ✅ **SEO Otimizado**

- Meta tags carregam imediatamente no HTML
- Crawlers conseguem ler o conteúdo sem JavaScript
- Melhor indexação nos motores de busca

### ✅ **Compartilhamento Perfeito**

- OpenGraph funciona em todas as redes sociais
- Twitter Cards otimizados
- WhatsApp, Telegram, LinkedIn, etc.

### ✅ **Performance**

- Carregamento mais rápido
- Menos JavaScript para processar
- Melhor Core Web Vitals

### ✅ **Manutenibilidade**

- Configurações centralizadas
- Fácil atualização de URLs e textos
- Código mais limpo

## Como Atualizar

### 1. Mudar URL da Imagem

Edite o arquivo `composables/useSEO.ts`:

```typescript
const siteConfig = {
  // ...
  image: "https://maromba.guima.digital/nova-imagem.png",
  // ...
};
```

### 2. Atualizar Descrição

Edite o arquivo `spa-loading-template.html`:

```html
<meta name="description" content="Nova descrição aqui..." />
<meta property="og:description" content="Nova descrição aqui..." />
<meta name="twitter:description" content="Nova descrição aqui..." />
```

### 3. Adicionar Novas Páginas

Use o composable `useSEO`:

```typescript
const { getPageSEO } = useSEO();

useHead(
  getPageSEO({
    title: "Título da Página",
    description: "Descrição específica",
    url: "https://maromba.guima.digital/nova-pagina",
  })
);
```

## Testando

### 1. Facebook Debugger

https://developers.facebook.com/tools/debug/

### 2. Twitter Card Validator

https://cards-dev.twitter.com/validator

### 3. LinkedIn Post Inspector

https://www.linkedin.com/post-inspector/

### 4. WhatsApp Preview

Compartilhe o link no WhatsApp para ver o preview

## Dimensões da Imagem

- **Recomendado**: 1200x630px (proporção 1.91:1)
- **Atual**: 1200x630px (proporção personalizada)
- **Formato**: PNG (suporta transparência)
- **Tamanho**: Máximo 8MB

## Próximos Passos

1. **Criar a imagem banner** em 1200x630px
2. **Fazer upload** para `https://maromba.guima.digital/og-banner.png`
3. **Testar** em todas as redes sociais
4. **Monitorar** métricas de SEO e compartilhamento
