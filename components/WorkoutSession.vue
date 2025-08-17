<template>
  <div
    v-if="trainingData"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-full max-h-[90vh] transition-colors duration-200"
  >
    <!-- Header com botão de fechar -->
    <div
      class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
    >
      <div>
        <h2
          class="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200"
        >
          {{ session.dayName }}
        </h2>
        <p
          class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
        >
          {{ formatDate(session.date) }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <span
            class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
            >Status:</span
          >
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="
              session.completed
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
            "
          >
            {{ session.completed ? "Concluído" : "Em andamento" }}
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          title="Fechar"
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
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Conteúdo scrollável -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Exercícios -->
      <div class="space-y-6">
        <div
          v-for="(exercise, exerciseIndex) in session.exercises"
          :key="exerciseIndex"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200"
        >
          <h3
            class="font-semibold text-gray-800 dark:text-white mb-3 transition-colors duration-200"
          >
            {{ exercise.exerciseName }}
          </h3>

          <!-- Séries -->
          <div class="space-y-3">
            <div
              v-for="(set, setIndex) in exercise.sets"
              :key="setIndex"
              class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <div
                class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200"
              >
                {{ setIndex + 1 }}
              </div>

              <div class="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label
                    class="block text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200"
                    >Repetições</label
                  >
                  <input
                    v-model.number="set.reps"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    :disabled="set.completed"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200"
                    >Peso (kg)</label
                  >
                  <input
                    v-model.number="set.weight"
                    type="number"
                    min="0"
                    step="0.5"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    :disabled="set.completed"
                  />
                </div>
              </div>

              <button
                @click="toggleSet(exerciseIndex, setIndex)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                :class="
                  set.completed
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                "
              >
                {{ set.completed ? "✓" : "Marcar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer fixo com botão de concluir -->
    <div
      class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex-shrink-0 transition-colors duration-200"
    >
      <button
        @click="completeSession"
        :disabled="session.completed"
        class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {{ session.completed ? "Treino Concluído" : "Concluir Treino" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkoutSession as WorkoutSessionType } from "~/types/training";

interface Props {
  session: WorkoutSessionType;
}

interface Emits {
  (e: "close"): void;
  (e: "update", session: WorkoutSessionType): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { trainingData, completeWorkoutSession } = useTraining();

const session = ref({ ...props.session });

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toggleSet = (exerciseIndex: number, setIndex: number) => {
  session.value.exercises[exerciseIndex].sets[setIndex].completed =
    !session.value.exercises[exerciseIndex].sets[setIndex].completed;

  emit("update", session.value);
};

const completeSession = () => {
  session.value.completed = true;
  completeWorkoutSession(session.value.id);
  emit("update", session.value);
  emit("close");
};

// Atualizar quando props mudarem
watch(
  () => props.session,
  (newSession) => {
    session.value = { ...newSession };
  },
  { deep: true }
);
</script>
