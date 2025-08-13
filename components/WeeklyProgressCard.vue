<template>
  <div v-if="trainingData" class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800">Progresso Semanal</h2>
      <div class="text-sm text-gray-600">
        {{ weekRange }}
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-blue-600">
          {{ stats.completed }}
        </div>
        <div class="text-sm text-blue-800">Treinos Realizados</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.total }}</div>
        <div class="text-sm text-green-800">Total de Sessões</div>
      </div>
    </div>

    <!-- Dias da semana -->
    <div class="space-y-2">
      <div
        v-for="day in stats.days"
        :key="day.day"
        class="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
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
          <span class="font-medium text-gray-700">{{ day.day }}</span>
        </div>

        <div class="flex items-center space-x-3">
          <div class="text-right">
            <div
              v-if="day.isRestDay"
              class="text-sm font-medium text-purple-600"
            >
              Descanso
            </div>
            <div
              v-else-if="day.hasSession"
              class="text-sm font-medium text-blue-600"
            >
              {{ day.sessionWorkoutName }}
            </div>
            <div
              v-if="day.hasSession && !day.isRestDay"
              class="text-xs text-gray-600"
            >
              {{ day.completed ? "Concluído" : "Pendente" }}
            </div>
            <div v-else-if="!day.hasSession" class="text-xs text-gray-400">
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

    <!-- Botão para adicionar treino -->
    <div class="mt-6 space-y-2">
      <button
        @click="showAddWorkout = true"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        + Adicionar Treino
      </button>
    </div>

    <!-- Modal para adicionar treino -->
    <Dialog v-model="showAddWorkout">
      <div class="p-6 w-full max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800">Selecionar Treino</h3>
          <button
            @click="showAddWorkout = false"
            class="text-gray-400 hover:text-gray-600"
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
            <div class="text-gray-400 mb-2">
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
            <p class="text-gray-600">Nenhum treino disponível</p>
          </div>

          <button
            v-for="day in availableDays"
            :key="day.nome"
            @click="addWorkout(day.nome)"
            class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-semibold text-gray-800 text-lg mb-1">
                  {{ day.nome }}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">Grupos musculares:</span>
                  {{ day.grupo_muscular.join(", ") }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ day.exercicios.length }} exercícios •
                  {{ getTotalSets(day) }} séries totais
                </div>
              </div>
              <div class="ml-3">
                <svg
                  class="w-5 h-5 text-gray-400"
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

        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            @click="showAddWorkout = false"
            class="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
          <h3 class="text-lg font-bold text-gray-800">
            {{ selectedDay?.day }}
          </h3>
          <button
            @click="showDayOptions = false"
            class="text-gray-400 hover:text-gray-600"
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
              @click="showAddWorkout = true"
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
              <p class="text-sm text-gray-600 mb-2">
                Este dia está marcado como descanso
              </p>
            </div>
            <div v-else class="mb-4">
              <p class="text-sm text-gray-600 mb-2">
                Treino:
                <span class="font-medium">{{
                  selectedDay.sessionWorkoutName
                }}</span>
              </p>
              <p class="text-sm text-gray-600">
                Status:
                <span class="font-medium">{{
                  selectedDay.completed ? "Concluído" : "Pendente"
                }}</span>
              </p>
            </div>

            <button
              @click="deleteDaySession(selectedDay.day)"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Deletar Sessão
            </button>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            @click="showDayOptions = false"
            class="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
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
} = useTraining();

console.log("addWorkoutSession importada:", typeof addWorkoutSession);

const showAddWorkout = ref(false);

const stats = computed(() => getWeeklyStats.value);

// Computed para formatar o intervalo da semana
const weekRange = computed(() => {
  if (!currentWeek.value) {
    return "Carregando...";
  }
  return formatWeekRange(currentWeek.value);
});

const availableDays = computed(() => {
  console.log("availableDays computed - trainingData:", trainingData.value);
  if (!trainingData.value || !trainingData.value.treino) {
    console.log("trainingData ou treino não disponível");
    return [];
  }
  const dias = trainingData.value.treino.dias || [];
  console.log("availableDays computed - dias encontrados:", dias);
  console.log(
    "Nomes dos dias:",
    dias.map((d) => d.nome)
  );
  return dias;
});

// Watcher para monitorar mudanças nos dias disponíveis
watch(
  availableDays,
  (newDays) => {
    console.log("availableDays mudou:", newDays);
    console.log("Número de dias disponíveis:", newDays.length);
  },
  { deep: true }
);

// Watcher para forçar atualização quando trainingData mudar
watch(
  trainingData,
  (newData) => {
    console.log("trainingData mudou no WeeklyProgressCard:", newData);
    if (newData?.treino?.dias) {
      console.log(
        "Dias disponíveis após mudança:",
        newData.treino.dias.map((d) => d.nome)
      );
    }
  },
  { deep: true, immediate: true }
);

const formatWeekRange = (weekStart: string) => {
  if (!weekStart) {
    return "Carregando...";
  }

  const start = new Date(weekStart);
  if (isNaN(start.getTime())) {
    return "Data inválida";
  }

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} - ${end.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })}`;
};

const getDayCardClass = (day: any) => {
  if (!day.hasSession) return "border-gray-200 bg-gray-50";
  if (day.completed) return "border-green-200 bg-green-50";
  return "border-yellow-200 bg-yellow-50";
};

const getDayCircleClass = (day: any) => {
  if (!day.hasSession) return "bg-gray-200 text-gray-600";
  if (day.completed) return "bg-green-500 text-white";
  return "bg-yellow-400 text-white";
};

const getTotalSets = (day: any) => {
  return day.exercicios.reduce((total: number, exercise: any) => {
    return total + exercise.numero_series;
  }, 0);
};

const addWorkout = (dayName: string) => {
  console.log("addWorkout chamada com dayName:", dayName);
  console.log("trainingData antes de addWorkoutSession:", trainingData.value);

  try {
    addWorkoutSession(dayName);
    console.log("addWorkoutSession executada com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar workout session:", error);
  }

  showAddWorkout.value = false;
};

const handleDayClick = (day: any) => {
  console.log("handleDayClick chamada com day:", day);

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
    console.log("Dia marcado como descanso:", dayName);
  } catch (error) {
    console.error("Erro ao marcar dia como descanso:", error);
  }
  showDayOptions.value = false;
  selectedDay.value = null;
};

const deleteDaySession = (dayName: string) => {
  try {
    deleteSessionByDay(dayName);
    console.log("Sessão deletada para o dia:", dayName);
  } catch (error) {
    console.error("Erro ao deletar sessão:", error);
  }
  showDayOptions.value = false;
  selectedDay.value = null;
};

const showDayOptions = ref(false);
const selectedDay = ref<any>(null);
</script>
