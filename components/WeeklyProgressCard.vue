<template>
  <div
    v-if="trainingData"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200"
  >
    <div class="flex items-center justify-between mb-4">
      <h2
        class="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200"
      >
        Progresso Semanal
      </h2>
      <div
        class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
      >
        {{ weekRange }}
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div
        class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center transition-colors duration-200"
      >
        <div
          class="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200"
        >
          {{ stats.completed }}
        </div>
        <div
          class="text-sm text-blue-800 dark:text-blue-200 transition-colors duration-200"
        >
          Treinos Realizados
        </div>
      </div>
      <div
        class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center transition-colors duration-200"
      >
        <div
          class="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200"
        >
          {{ stats.total }}
        </div>
        <div
          class="text-sm text-green-800 dark:text-green-200 transition-colors duration-200"
        >
          Total de Sessões
        </div>
      </div>
    </div>

    <!-- Dias da semana -->
    <div class="space-y-2">
      <div
        v-for="day in stats.days"
        :key="day.day"
        class="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        :class="getDayCardClass(day)"
        @click="handleDayClick(day)"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="getDayCircleClass(day)"
          >
            {{ day.day.charAt(0) }}
          </div>
          <span
            class="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
            >{{ day.day }}</span
          >
        </div>

        <div class="flex items-center space-x-3">
          <div class="text-right">
            <div
              v-if="day.isRestDay"
              class="text-sm font-medium text-purple-600 dark:text-purple-400 transition-colors duration-200"
            >
              Descanso
            </div>
            <div
              v-else-if="day.hasSession"
              class="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-200"
            >
              {{ day.sessionWorkoutName }}
            </div>
            <div
              v-if="day.hasSession && !day.isRestDay"
              class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              {{ day.completed ? "Concluído" : "Pendente" }}
            </div>
            <div
              v-else-if="!day.hasSession"
              class="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-200"
            >
              Clique para adicionar
            </div>
          </div>

          <div
            v-if="day.hasSession"
            class="w-4 h-4 rounded-full"
            :class="
              day.isRestDay
                ? 'bg-purple-500'
                : day.completed
                ? 'bg-green-500'
                : 'bg-yellow-400'
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- Botão para limpar todas as sessões -->
    <div class="mt-6 space-y-2" v-if="stats.total > 0">
      <button
        @click="showClearConfirmation = true"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
      >
        🗑️ Limpar Todas as Sessões
      </button>
    </div>

    <!-- Modal para adicionar treino -->
    <Dialog v-model="showAddWorkout">
      <div class="p-6 w-full max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-200"
          >
            Selecionar Treino
          </h3>
          <button
            @click="showAddWorkout = false"
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Lista de treinos disponíveis -->
        <div class="space-y-3">
          <!-- Empty state -->
          <div v-if="availableDays.length === 0" class="text-center py-8">
            <div class="text-gray-400 dark:text-gray-500 mb-2">
              <svg
                class="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p
              class="text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >
              Nenhum treino disponível
            </p>
          </div>

          <button
            v-for="day in availableDays"
            :key="day.nome"
            @click="addWorkoutAndOpenSession(day.nome)"
            class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div
                  class="font-semibold text-gray-800 dark:text-white text-lg mb-1 transition-colors duration-200"
                >
                  {{ day.nome }}
                </div>
                <div
                  class="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200"
                >
                  <span class="font-medium">Grupos musculares:</span>
                  {{ day.grupo_muscular.join(", ") }}
                </div>
                <div
                  class="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-200"
                >
                  {{ day.exercicios.length }} exercícios •
                  {{ getTotalSets(day) }} séries totais
                </div>
              </div>
              <div class="flex items-center justify-center ml-3">
                <svg
                  class="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="showAddWorkout = false"
            class="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Dialog>

    <!-- Modal de opções do dia -->
    <Dialog v-model="showDayOptions">
      <div class="p-6 w-full max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-200"
          >
            {{ selectedDay?.day }}
          </h3>
          <button
            @click="showDayOptions = false"
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedDay" class="space-y-3">
          <!-- Se não tem sessão -->
          <div v-if="!selectedDay.hasSession">
            <button
              @click="handleAddWorkoutFromDayOptions"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-2"
            >
              Adicionar Treino
            </button>

            <button
              @click="markAsRest(selectedDay.day)"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Marcar como Descanso
            </button>
          </div>

          <!-- Se já tem sessão -->
          <div v-else>
            <div v-if="selectedDay.isRestDay" class="mb-4">
              <p
                class="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200"
              >
                Este dia está marcado como descanso
              </p>
            </div>
            <div v-else class="mb-4">
              <p
                class="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200"
              >
                Treino:
                <span class="font-medium">{{
                  selectedDay.sessionWorkoutName
                }}</span>
              </p>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
              >
                Status:
                <span class="font-medium">{{
                  selectedDay.completed ? "Concluído" : "Pendente"
                }}</span>
              </p>
            </div>

            <div class="space-y-2">
              <button
                v-if="!selectedDay.completed"
                @click="openWorkoutSession(selectedDay.day)"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Preencher Treino
              </button>

              <button
                v-if="!selectedDay.completed"
                @click="markDayAsCompleted(selectedDay.day)"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Marcar como Concluído
              </button>

              <button
                @click="deleteDaySession(selectedDay.day)"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Deletar Sessão
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="showDayOptions = false"
            class="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Dialog>

    <!-- Modal de confirmação para limpar sessões -->
    <Dialog v-model="showClearConfirmation">
      <div class="p-6 w-full max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-200"
          >
            Confirmar Limpeza
          </h3>
          <button
            @click="showClearConfirmation = false"
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p
            class="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200"
          >
            Tem certeza que deseja limpar todas as sessões da semana atual?
          </p>
          <p
            class="text-sm text-red-600 dark:text-red-400 font-medium transition-colors duration-200"
          >
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div class="flex space-x-3">
          <button
            @click="clearAllSessionsHandler"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sim, Limpar Tudo
          </button>
          <button
            @click="showClearConfirmation = false"
            class="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Dialog>

    <!-- Modal para preencher treino -->
    <Dialog v-model="showWorkoutSession">
      <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <WorkoutSession
          v-if="selectedSession"
          :session="selectedSession"
          @close="showWorkoutSession = false"
          @update="handleSessionUpdate"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const {
  trainingData,
  currentWeek,
  getWeeklyStats,
  addWorkoutSession,
  markDayAsRest,
  deleteSessionByDay,
  clearAllSessions,
  getCurrentWeekProgress,
  weeklyProgress,
} = useTraining();

const showAddWorkout = ref(false);
const showDayOptions = ref(false);
const showWorkoutSession = ref(false);
const selectedDay = ref<any>(null);
const selectedSession = ref<any>(null);

const stats = computed(() => getWeeklyStats.value);

// Computed para formatar o intervalo da semana
const weekRange = computed(() => {
  if (!currentWeek.value) {
    return "Carregando...";
  }
  return formatWeekRange(currentWeek.value);
});

const availableDays = computed(() => {
  if (!trainingData.value || !trainingData.value.treino) {
    return [];
  }
  const dias = trainingData.value.treino.dias || [];
  return dias;
});

// Watcher para monitorar mudanças nos dias disponíveis
watch(
  availableDays,
  (newDays) => {
    // Monitoramento silencioso das mudanças
  },
  { deep: true }
);

// Watcher para forçar atualização quando trainingData mudar
watch(
  trainingData,
  (newData) => {
    // Atualização silenciosa quando trainingData mudar
  },
  { deep: true, immediate: true }
);

const formatWeekRange = (weekStart: string) => {
  if (!weekStart) {
    return "Carregando...";
  }

  // Criar datas no timezone do Brasil
  const start = new Date(weekStart + "T00:00:00-03:00");
  if (isNaN(start.getTime())) {
    return "Data inválida";
  }

  // Criar uma nova data para o final da semana (domingo) no timezone do Brasil
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Sao_Paulo",
  })} - ${end.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Sao_Paulo",
  })}`;
};

const getDayCardClass = (day: any) => {
  if (!day.hasSession)
    return "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700";
  if (day.isRestDay)
    return "border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20";
  if (day.completed)
    return "border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20";
  return "border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
};

const getDayCircleClass = (day: any) => {
  if (!day.hasSession)
    return "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300";
  if (day.isRestDay) return "bg-purple-500 text-white";
  if (day.completed) return "bg-green-500 text-white";
  return "bg-yellow-400 text-white";
};

const getTotalSets = (day: any) => {
  return day.exercicios.reduce((total: number, exercise: any) => {
    return total + exercise.numero_series;
  }, 0);
};

const addWorkout = (dayName: string) => {
  try {
    // Se estamos adicionando um treino a um dia específico da semana
    if (selectedDay.value && selectedDay.value.day) {
      addWorkoutSession(dayName, selectedDay.value.day);
    } else {
      // Fallback: usar apenas o nome do treino
      addWorkoutSession(dayName);
    }
  } catch (error) {
    console.error("Erro ao adicionar workout session:", error);
  }

  showAddWorkout.value = false;
};

const addWorkoutAndOpenSession = (dayName: string) => {
  try {
    // Se estamos adicionando um treino a um dia específico da semana
    if (selectedDay.value && selectedDay.value.day) {
      addWorkoutSession(dayName, selectedDay.value.day);
      // Abrir o dialog de edição para o dia selecionado
      setTimeout(() => {
        openWorkoutSession(selectedDay.value.day);
      }, 100);
    } else {
      // Fallback: usar apenas o nome do treino
      addWorkoutSession(dayName);
    }
  } catch (error) {
    console.error("Erro ao adicionar workout session:", error);
  }

  showAddWorkout.value = false;
};

const handleDayClick = (day: any) => {
  if (day.hasSession) {
    // Se já tem sessão, mostrar opções de editar/deletar
    showDayOptions.value = true;
    selectedDay.value = day;
  } else {
    // Se não tem sessão, mostrar opções de adicionar treino ou marcar descanso
    showDayOptions.value = true;
    selectedDay.value = day;
  }
};

const markAsRest = (dayName: string) => {
  try {
    markDayAsRest(dayName);
  } catch (error) {
    console.error("Erro ao marcar dia como descanso:", error);
  }
  showDayOptions.value = false;
  selectedDay.value = null;
};

const deleteDaySession = (dayName: string) => {
  try {
    deleteSessionByDay(dayName);
  } catch (error) {
    console.error("Erro ao deletar sessão:", error);
  }
  showDayOptions.value = false;
  selectedDay.value = null;
};

const clearAllSessionsHandler = () => {
  try {
    clearAllSessions();
  } catch (error) {
    console.error("Erro ao limpar sessões:", error);
  }
  showClearConfirmation.value = false;
};

const handleAddWorkoutFromDayOptions = () => {
  showDayOptions.value = false;
  showAddWorkout.value = true;
};

const openWorkoutSession = (dayName: string) => {
  const weekProgress = getCurrentWeekProgress.value;
  if (weekProgress) {
    const session = weekProgress.sessions.find((s) => s.dayName === dayName);
    if (session) {
      selectedSession.value = session;
      showWorkoutSession.value = true;
      showDayOptions.value = false;
    }
  }
};

const handleSessionUpdate = (updatedSession: any) => {
  selectedSession.value = updatedSession;
  // Atualizar a sessão no progresso da semana
  const weekProgress = getCurrentWeekProgress.value;
  if (weekProgress) {
    const sessionIndex = weekProgress.sessions.findIndex(
      (s) => s.id === updatedSession.id
    );
    if (sessionIndex !== -1) {
      weekProgress.sessions[sessionIndex] = updatedSession;
      // Salvar o progresso
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "maromba-weekly-progress",
          JSON.stringify(weeklyProgress.value)
        );
      }
    }
  }
};

const markDayAsCompleted = (dayName: string) => {
  const weekProgress = getCurrentWeekProgress.value;
  if (weekProgress) {
    const session = weekProgress.sessions.find((s) => s.dayName === dayName);
    if (session) {
      session.completed = true;
      // Salvar o progresso
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "maromba-weekly-progress",
          JSON.stringify(weeklyProgress.value)
        );
      }
    }
  }
  showDayOptions.value = false;
  selectedDay.value = null;
};

const showClearConfirmation = ref(false);
</script>
