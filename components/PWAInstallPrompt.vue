<template>
  <Transition name="fade" mode="out-in" appear>
    <div
      v-if="showInstallPrompt && !hasJustDismissed && waitedLongEnough"
      class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg"
    >
      <div class="flex items-center justify-between max-w-md mx-auto">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-sm">Instalar Maromba</p>
            <p class="text-xs opacity-90">Adicione ao seu dispositivo</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="install"
            class="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Instalar
          </button>
          <button
            @click="dismissPrompt"
            class="text-white/80 hover:text-white transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const {
  isInstalled,
  canInstall,
  install,
  markAsDismissed,
  hasUserDismissed,
  init,
} = usePWAInstall();

const waitedLongEnough = ref(false);
const hasJustDismissed = ref(false);

const showInstallPrompt = computed(() => {
  console.log({
    canInstall: canInstall.value,
    isInstalled: isInstalled.value,
    hasUserDismissed: hasUserDismissed(),
  });
  return canInstall.value && !isInstalled.value && !hasUserDismissed();
});

// Função para fechar o prompt
function dismissPrompt() {
  markAsDismissed();
  hasJustDismissed.value = true;
}

onMounted(() => {
  init();
  setTimeout(() => {
    waitedLongEnough.value = true;
  }, 500);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
