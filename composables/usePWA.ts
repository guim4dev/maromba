export const usePWAInstall = () => {
  const { $pwa } = useNuxtApp();
  const isIOS = ref(false);

  // Detectar iOS
  const detectIOS = () => {
    if (!import.meta.client) return;

    const ua = window.navigator.userAgent;
    // iPadOS 13+ identifies as Mac, so check for touch support as well
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Macintosh") && "ontouchend" in document);

    isIOS.value = isIOSDevice && !(window as any).MSStream;
  };

  // Verificar se o usuário já rejeitou o prompt
  const hasUserDismissed = () => {
    if (import.meta.client) {
      return sessionStorage.getItem("pwa-dismissed") === "true";
    }
    return false;
  };

  // Marcar como rejeitado
  const markAsDismissed = () => {
    if (import.meta.client) {
      sessionStorage.setItem("pwa-dismissed", "true");
    }
  };

  // Instalar PWA
  const install = async () => {
    // if (isIOS.value) {
    //   // Para iOS, mostrar instruções
    //   showIOSInstructions();
    // } else
    if ($pwa) {
      // Usar a função nativa do $pwa
      await $pwa.install();
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

  // Computed properties usando $pwa nativo
  const isInstalled = computed(() => {
    if (!$pwa) return false;
    // Usar a propriedade correta baseada na documentação
    return $pwa.isPWAInstalled || false;
  });

  const canInstall = computed(() => {
    // if (isIOS.value) {
    //   return !isInstalled.value && !hasUserDismissed();
    // }
    console.log("showInstallPrompt", $pwa?.showInstallPrompt);
    return $pwa?.showInstallPrompt || false;
  });

  // Inicializar
  const init = () => {
    if (import.meta.client) {
      // detectIOS(); // Comentado temporariamente
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
