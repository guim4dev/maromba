<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">💪 Maromba</h1>
            <p class="text-sm text-gray-600">Tracking de Treino</p>
          </div>

          <!-- PWA Install Button -->
          <div v-if="$pwa?.showInstallPrompt">
            <button
              @click="$pwa.install()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Instalar App
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Global Loading State -->
    <div
      v-if="isLoading || !trainingData"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">
          Carregando aplicação...
        </h2>
        <p class="text-gray-600">
          Aguarde enquanto carregamos seus dados de treinamento
        </p>
      </div>
    </div>

    <!-- Main Content - Only render when trainingData is available -->
    <main v-else class="max-w-4xl mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Progresso Semanal -->
        <WeeklyProgressCard />

        <!-- PWA Update Notification -->
        <div
          v-if="$pwa?.needRefresh"
          class="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="text-blue-800">Nova versão disponível</span>
            </div>
            <button
              @click="$pwa.updateServiceWorker()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer with Copyright -->
    <footer class="mt-8 py-4 border-t bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center">
          <p class="text-sm text-gray-500 mb-2">
            Vibecoded by Guim4 Tecnologia
          </p>
          <a
            href="https://github.com/guim4dev/maromba"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-sm">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";

const {
  trainingData,
  currentWeek,
  getCurrentWeekProgress,
  loadTrainingData,
  loadProgress,
  initializeCurrentWeek,
  isLoading,
} = useTraining();

// Carregar dados de treinamento

onMounted(async () => {
  try {
    console.log("Iniciando carregamento da aplicação...");
    await loadTrainingData(true);

    console.log("Dados de treinamento carregados:", trainingData.value);

    // Aguardar um pouco para garantir que a reatividade seja processada
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Carregar progresso salvo
    loadProgress();
    console.log("Progresso carregado");

    // Inicializar semana atual
    initializeCurrentWeek();
    console.log("Semana atual inicializada:", currentWeek.value);

    // Aguardar um tick para garantir que a reatividade seja processada
    await nextTick();
    console.log("Aplicação inicializada com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar app:", error);
  }
});

// Watcher para monitorar mudanças nos dados de treinamento
watch(
  trainingData,
  (newData) => {
    console.log("trainingData mudou na página principal:", newData);
    if (newData?.treino?.dias) {
      console.log(
        "Dias disponíveis na página principal:",
        newData.treino.dias.map((d) => d.nome)
      );
    }
  },
  { deep: true }
);
</script>
