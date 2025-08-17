export const usePWAInstall = () => {
  const isInstalled = ref(false);
  const canInstall = ref(false);
  const deferredPrompt = ref<any>(null);
  const isMobile = ref(false);

  // Detectar dispositivo móvel
  const detectMobile = () => {
    if (import.meta.client) {
      isMobile.value =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
    }
  };

  // Verificar se o PWA já foi instalado
  const checkIfInstalled = () => {
    if (import.meta.client) {
      isInstalled.value =
        localStorage.getItem("pwa-installed") === "true" ||
        window.matchMedia("(display-mode: standalone)").matches;
    }
  };

  // Verificar se o usuário já rejeitou o prompt
  const hasUserDismissed = () => {
    if (import.meta.client) {
      return localStorage.getItem("pwa-dismissed") === "true";
    }
    return false;
  };

  // Marcar como instalado
  const markAsInstalled = () => {
    if (import.meta.client) {
      localStorage.setItem("pwa-installed", "true");
      isInstalled.value = true;
    }
  };

  // Marcar como rejeitado
  const markAsDismissed = () => {
    if (import.meta.client) {
      localStorage.setItem("pwa-dismissed", "true");
    }
  };

  // Instalar PWA
  const install = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;

      if (outcome === "accepted") {
        markAsInstalled();
        console.log("PWA instalado com sucesso!");
      } else {
        console.log("Instalação do PWA rejeitada");
      }

      deferredPrompt.value = null;
      canInstall.value = false;
    }
  };

  // Inicializar listeners
  const init = () => {
    if (import.meta.client) {
      detectMobile();
      checkIfInstalled();

      // Escutar o evento beforeinstallprompt
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
        canInstall.value = true;
      });

      // Escutar o evento appinstalled
      window.addEventListener("appinstalled", () => {
        markAsInstalled();
        canInstall.value = false;
        deferredPrompt.value = null;
      });
    }
  };

  return {
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    isMobile: readonly(isMobile),
    install,
    markAsDismissed,
    hasUserDismissed,
    init,
  };
};
