# Componentes

## Dialog

Componente de diálogo reutilizável com animações e funcionalidades de acessibilidade.

### Funcionalidades

- ✅ Fechar ao clicar fora do diálogo
- ✅ Fechar com a tecla ESC
- ✅ Animações suaves de entrada e saída
- ✅ Suporte a v-model
- ✅ Prevenção de propagação de cliques no conteúdo

### Uso

```vue
<template>
  <Dialog v-model="showDialog">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Título do Diálogo</h2>
      <p>Conteúdo do diálogo aqui...</p>
      <button @click="showDialog = false">Fechar</button>
    </div>
  </Dialog>
</template>

<script setup>
const showDialog = ref(false);
</script>
```

### Props

| Prop              | Tipo      | Padrão | Descrição                          |
| ----------------- | --------- | ------ | ---------------------------------- |
| `modelValue`      | `boolean` | -      | Controla se o diálogo está visível |
| `closeOnBackdrop` | `boolean` | `true` | Se deve fechar ao clicar fora      |

### Events

| Event               | Payload   | Descrição                                    |
| ------------------- | --------- | -------------------------------------------- |
| `update:modelValue` | `boolean` | Emitido quando o estado de visibilidade muda |

### Animações

O componente usa as seguintes animações do Tailwind CSS:

- **Backdrop**: Fade in/out com duração de 300ms (entrada) e 200ms (saída)
- **Conteúdo**: Fade + scale com duração de 300ms (entrada) e 200ms (saída)

### Acessibilidade

- Suporte a navegação por teclado (ESC para fechar)
- Foco automático no conteúdo do diálogo
- Prevenção de scroll no body quando aberto
