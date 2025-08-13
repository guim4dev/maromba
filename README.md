# Maromba - Tracking de Treino

Uma PWA (Progressive Web App) para acompanhamento de treinos de musculação, desenvolvida com Nuxt 3, Tailwind CSS e PWA capabilities.

## 🚀 Features

- **Progresso Semanal**: Acompanhe seus treinos da semana atual
- **Histórico de Treinos**: Visualize treinos realizados e pendentes
- **Interação Durante o Treino**: Marque séries e exercícios conforme executa
- **PWA**: Instale no seu celular como um app nativo
- **Offline**: Funciona sem conexão com internet
- **Responsivo**: Interface otimizada para mobile

## 📱 PWA Features

- ✅ Instalação no celular
- ✅ Funcionamento offline
- ✅ Atualizações automáticas
- ✅ Interface nativa
- ✅ Notificações de atualização

## 🛠️ Tecnologias

- **Nuxt 3** - Framework Vue.js
- **Tailwind CSS** - Framework CSS
- **@vite-pwa/nuxt** - PWA capabilities
- **TypeScript** - Tipagem estática
- **LocalStorage** - Persistência de dados

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd maromba
```

2. Instale as dependências:

```bash
yarn install
# ou
npm install
```

3. Execute o projeto:

```bash
yarn dev
# ou
npm run dev
```

4. Acesse `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
maromba/
├── components/           # Componentes Vue
│   ├── WeeklyProgressCard.vue
│   └── WorkoutSession.vue
├── composables/          # Composables Vue
│   └── useTraining.ts
├── pages/               # Páginas do app
│   └── index.vue
├── types/               # Tipos TypeScript
│   └── training.ts
├── public/              # Arquivos estáticos
│   └── training-schedules/
│       └── current/
│           └── training.json
├── app.vue              # App principal
├── nuxt.config.ts       # Configuração Nuxt
└── tailwind.config.js   # Configuração Tailwind
```

## 📊 Dados de Treinamento

O app utiliza o arquivo `public/training-schedules/current/training.json` que contém:

- **Princípios Gerais**: Cadência, carga e descanso
- **Dias de Treino**: Push, Pull, Legs, Upper, Lower + Core
- **Exercícios**: Nome, repetições, cadência, descanso e séries

## 🔄 Funcionalidades

### Progresso Semanal

- Visualização da semana atual (segunda a domingo)
- Contador de treinos realizados vs total
- Status de cada dia (sem treino, pendente, concluído)

### Sessões de Treino

- Adicionar treinos para a semana
- Interagir durante o treino
- Marcar séries e exercícios
- Registrar peso e repetições

### Persistência

- Dados salvos no localStorage
- Progresso mantido entre sessões
- Sem necessidade de servidor

## 📱 Como Usar

1. **Adicionar Treino**: Clique em "+ Adicionar Treino" e selecione o tipo
2. **Iniciar Treino**: Clique na sessão para abrir o treino
3. **Marcar Séries**: Durante o treino, marque as séries conforme executa
4. **Concluir**: Marque o treino como concluído quando terminar

## 🚀 Build para Produção

```bash
yarn build
yarn preview
```

## 📋 Próximas Features

- [ ] Histórico de semanas anteriores
- [ ] Estatísticas de progresso
- [ ] Notificações de lembretes
- [ ] Exportar dados
- [ ] Temas personalizáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
