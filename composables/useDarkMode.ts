import { ref, watch, onMounted } from "vue";

export const useDarkMode = () => {
  const isDark = ref(false);

  // Função para alternar o modo
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    updateTheme();
  };

  // Função para definir o modo
  const setDarkMode = (dark: boolean) => {
    isDark.value = dark;
    updateTheme();
  };

  // Função para atualizar o tema no DOM
  const updateTheme = () => {
    if (typeof window !== "undefined") {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("maromba-dark-mode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("maromba-dark-mode", "false");
      }
    }
  };

  // Função para carregar o tema salvo
  const loadTheme = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("maromba-dark-mode");
      if (saved !== null) {
        isDark.value = saved === "true";
      } else {
        // Verificar preferência do sistema
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        isDark.value = prefersDark;
      }
      updateTheme();
    }
  };

  // Watcher para sincronizar mudanças
  watch(isDark, () => {
    updateTheme();
  });

  // Carregar tema na inicialização
  onMounted(() => {
    loadTheme();
  });

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    loadTheme,
  };
};
