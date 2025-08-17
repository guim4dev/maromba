export const usePWAInstall = () => {
  const isInstalled = ref(false);
  const canInstall = ref(false);
  const deferredPrompt = ref<any>(null);
  const isIOS = ref(false);

  // Detectar iOS
  /**
   * Detects if the current device is running iOS.
   * Sets isIOS.value to true for iPad, iPhone, or iPod (including iPadOS 13+ in desktop mode).
   */
  const detectIOS = () => {
    if (!import.meta.client) return;

    const ua = window.navigator.userAgent;
    // iPadOS 13+ identifies as Mac, so check for touch support as well
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Macintosh") && "ontouchend" in document);

    isIOS.value = isIOSDevice && !(window as any).MSStream;
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
      return sessionStorage.getItem("pwa-dismissed") === "true";
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
      sessionStorage.setItem("pwa-dismissed", "true");
    }
  };

  // Instalar PWA
  const install = async () => {
    if (isIOS.value) {
      // Para iOS, mostrar instruções
      showIOSInstructions();
    } else if (deferredPrompt.value) {
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

  // Mostrar instruções para iOS
  const showIOSInstructions = () => {
    // Criar modal com instruções para iOS
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 mx-4 max-w-sm">
        <h3 class="text-lg font-semibold mb-4">Adicionar à Tela Inicial</h3>
        <div class="space-y-3 text-sm">
          <p>1. Toque no botão <strong>Compartilhar</strong> <span class="text-blue-500">⎋</span></p>
          <p>2. Role para baixo e toque em <strong>Adicionar à Tela Inicial</strong></p>
          <p>3. Toque em <strong>Adicionar</strong></p>
        </div>
        <button id="pwa-ios-understood-btn" class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Entendi
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Fechar modal ao clicar no botão ou fora do conteúdo
    const understoodBtn = modal.querySelector("#pwa-ios-understood-btn");
    if (understoodBtn) {
      understoodBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.body.removeChild(modal);
        markAsDismissed();
      });
    }
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        markAsDismissed();
      }
    });
  };

  // Inicializar listeners
  const init = () => {
    if (import.meta.client) {
      detectIOS();
      checkIfInstalled();

      if (isIOS.value) {
        // Para iOS, sempre mostrar o prompt se não foi instalado
        console.log("isIOS.value", isIOS.value);
        console.log("isInstalled.value", isInstalled.value);
        console.log("hasUserDismissed()", hasUserDismissed());
        canInstall.value = !isInstalled.value && !hasUserDismissed();
      } else {
        // Para outros navegadores, usar beforeinstallprompt
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          deferredPrompt.value = e;
          canInstall.value = true;
        });

        window.addEventListener("appinstalled", () => {
          markAsInstalled();
          canInstall.value = false;
          deferredPrompt.value = null;
        });
      }
    }
  };

  return {
    isInstalled: readonly(isInstalled),
    canInstall: readonly(canInstall),
    isIOS: readonly(isIOS),
    install,
    markAsDismissed,
    hasUserDismissed,
    init,
  };
};
