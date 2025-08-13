<template>
  <div v-if="trainingData" class="bg-white rounded-lg shadow-md">
    <!-- Header com botão de fechar -->
    <div class="flex items-center justify-between p-6 border-b">
      <div>
        <h2 class="text-xl font-bold text-gray-800">{{ session.dayName }}</h2>
        <p class="text-sm text-gray-600">{{ formatDate(session.date) }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Status:</span>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="
              session.completed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            "
          >
            {{ session.completed ? "Concluído" : "Em andamento" }}
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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

    <div class="p-6">
      <!-- Exercícios -->
      <div class="space-y-6">
        <div
          v-for="(exercise, exerciseIndex) in session.exercises"
          :key="exerciseIndex"
          class="border rounded-lg p-4"
        >
          <h3 class="font-semibold text-gray-800 mb-3">
            {{ exercise.exerciseName }}
          </h3>

          <!-- Séries -->
          <div class="space-y-3">
            <div
              v-for="(set, setIndex) in exercise.sets"
              :key="setIndex"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium"
              >
                {{ setIndex + 1 }}
              </div>

              <div class="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Repetições</label
                  >
                  <input
                    v-model.number="set.reps"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border rounded-lg text-sm"
                    :disabled="set.completed"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1"
                    >Peso (kg)</label
                  >
                  <input
                    v-model.number="set.weight"
                    type="number"
                    min="0"
                    step="0.5"
                    class="w-full px-3 py-2 border rounded-lg text-sm"
                    :disabled="set.completed"
                  />
                </div>
              </div>

              <button
                @click="toggleSet(exerciseIndex, setIndex)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="
                  set.completed
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
              >
                {{ set.completed ? "✓" : "Marcar" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de ação -->
      <div class="flex space-x-3 mt-6">
        <button
          @click="completeSession"
          :disabled="session.completed"
          class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {{ session.completed ? "Treino Concluído" : "Concluir Treino" }}
        </button>
      </div>
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
