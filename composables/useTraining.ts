import { ref, computed } from "vue";
import type {
  TrainingData,
  WorkoutSession,
  WeeklyProgress,
} from "~/types/training";

const trainingData = ref<TrainingData | null>(null);
const weeklyProgress = ref<WeeklyProgress[]>([]);
const currentWeek = ref<string>("");
const isLoading = ref(false);

export const useTraining = () => {
  // Carregar dados de treinamento
  const TRAINING_DATA_CACHE_KEY = "maromba_training_data_cache";
  const TRAINING_DATA_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 dias

  // Helper: Save to cache with timestamp
  function saveTrainingDataToCache(data: TrainingData) {
    const cache = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(TRAINING_DATA_CACHE_KEY, JSON.stringify(cache));
  }

  // Helper: Load from cache if not expired
  function loadTrainingDataFromCache(): TrainingData | null {
    try {
      const raw = localStorage.getItem(TRAINING_DATA_CACHE_KEY);
      if (!raw) return null;
      const cache = JSON.parse(raw);
      if (
        typeof cache === "object" &&
        cache.data &&
        cache.timestamp &&
        Date.now() - cache.timestamp < TRAINING_DATA_CACHE_TTL
      ) {
        return cache.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Helper: Fetch with timeout
  function fetchWithTimeout<T>(url: string, timeoutMs = 3000): Promise<T> {
    return new Promise((resolve, reject) => {
      let didTimeOut = false;
      const timeout = setTimeout(() => {
        didTimeOut = true;
        reject(new Error("Timeout"));
      }, timeoutMs);

      $fetch<T>(url)
        .then((result) => {
          if (!didTimeOut) {
            clearTimeout(timeout);
            resolve(result);
          }
        })
        .catch((err) => {
          if (!didTimeOut) {
            clearTimeout(timeout);
            reject(err);
          }
        });
    });
  }

  const loadTrainingData = async (force: boolean = false) => {
    if (trainingData.value && !force) {
      return;
    }

    isLoading.value = true;

    try {
      const url = "/training-schedules/current/training.json";
      let data: TrainingData | null = null;
      let triedFetch = false;
      let triedCache = false;

      // 1st attempt: fetch with timeout
      try {
        data = await fetchWithTimeout<TrainingData>(url, 3000);
        triedFetch = true;

        if (!data.treino || !data.treino.dias) {
          throw new Error(
            "Formato de dados inválido: estrutura treino.dias não encontrada"
          );
        }

        trainingData.value = data;
        saveTrainingDataToCache(data);
        return;
      } catch (error) {
        console.warn("Fetch falhou ou demorou demais:", error);
      }

      // 2nd attempt: load from cache
      try {
        data = loadTrainingDataFromCache();
        triedCache = true;
        if (data && data.treino && data.treino.dias) {
          trainingData.value = data;
          return;
        }
      } catch (error) {
        console.warn("Erro ao carregar do cache:", error);
      }

      // 3rd attempt: retry fetch (sem timeout)
      if (!triedFetch) {
        try {
          data = await $fetch<TrainingData>(url);
          if (!data.treino || !data.treino.dias) {
            throw new Error(
              "Formato de dados inválido: estrutura treino.dias não encontrada"
            );
          }
          trainingData.value = data;
          saveTrainingDataToCache(data);
          return;
        } catch (error) {
          console.error("Erro ao tentar fetch novamente:", error);
        }
      }

      // fallback: default data
      console.error(
        "Erro ao carregar dados de treinamento. Usando dados padrão."
      );
      trainingData.value = {
        treino: {
          principios_gerais: {
            cadencia: "excêntrica / pausa / concêntrica / pausa",
            carga: "última repetição próxima da falha (RIR 1–2)",
            descanso: "entre séries, conforme tipo de exercício",
          },
          dias: [],
        },
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Obter início da semana (segunda-feira) no timezone do Brasil
  const getWeekStart = (date: Date = new Date()): string => {
    // Obter a data atual no timezone do Brasil
    const brazilTime = new Date();
    const brazilDateString = brazilTime.toLocaleString("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Criar uma nova data no timezone do Brasil
    const [monthStr, dayStr, yearStr] = brazilDateString.split("/");
    const brazilDate = new Date(
      `${yearStr}-${monthStr}-${dayStr}T00:00:00-03:00`
    );

    const dayOfWeek = brazilDate.getDay();
    // getDay() retorna: 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado
    // Queremos que segunda-feira seja o início da semana
    // Se hoje é domingo (0), subtrair 6 dias para chegar na segunda anterior
    // Se hoje é segunda (1), não subtrair nada (0 dias)
    // Se hoje é terça (2), subtrair 1 dia para chegar na segunda
    // E assim por diante...
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Criar uma nova data para não modificar a original
    const weekStart = new Date(brazilDate);
    weekStart.setDate(brazilDate.getDate() - daysToSubtract);

    // Retornar no formato YYYY-MM-DD
    const yearResult = weekStart.getFullYear();
    const monthResult = String(weekStart.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(weekStart.getDate()).padStart(2, "0");
    return `${yearResult}-${monthResult}-${dayOfMonth}`;
  };

  // Obter semana atual
  const getCurrentWeek = () => {
    try {
      currentWeek.value = getWeekStart();
      return currentWeek.value;
    } catch (error) {
      console.error("Erro ao calcular semana atual:", error);
      // Fallback para data atual em formato ISO
      const today = new Date();
      currentWeek.value = today.toISOString().split("T")[0];
      return currentWeek.value;
    }
  };

  // Inicializar currentWeek imediatamente
  currentWeek.value = getWeekStart();

  // Obter progresso da semana atual
  const getCurrentWeekProgress = computed(() => {
    return weeklyProgress.value.find(
      (week) => week.weekStart === currentWeek.value
    );
  });

  // Criar sessão de treino
  const createWorkoutSession = (dayName: string): WorkoutSession => {
    const day = trainingData.value?.treino.dias.find((d) => d.nome === dayName);

    if (!day) {
      console.error("Dia de treino não encontrado para:", dayName);
      throw new Error("Dia de treino não encontrado");
    }

    const session = {
      id: `${dayName}-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      dayName,
      completed: false,
      isRestDay: false,
      exercises: day.exercicios.map((exercise) => ({
        exerciseName: exercise.nome,
        sets: Array.from({ length: exercise.numero_series }, () => ({
          reps: 0,
          weight: 0,
          completed: false,
        })),
      })),
    };

    return session;
  };

  // Criar sessão de descanso
  const createRestDaySession = (weekDay: string): WorkoutSession => {
    const session = {
      id: `rest-${weekDay}-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      dayName: weekDay,
      completed: true,
      isRestDay: true,
      exercises: [],
    };

    return session;
  };

  // Salvar progresso no localStorage
  const saveProgress = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "maromba-weekly-progress",
        JSON.stringify(weeklyProgress.value)
      );
    }
  };

  // Carregar progresso do localStorage
  const loadProgress = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("maromba-weekly-progress");
      if (saved) {
        weeklyProgress.value = JSON.parse(saved);
      }
    }
  };

  // Inicializar semana atual se não existir
  const initializeCurrentWeek = () => {
    try {
      getCurrentWeek();

      if (!getCurrentWeekProgress.value) {
        weeklyProgress.value.push({
          weekStart: currentWeek.value,
          sessions: [],
        });
        saveProgress();
      }
    } catch (error) {
      console.error("Erro ao inicializar semana atual:", error);
      // Garantir que currentWeek tenha um valor válido
      if (!currentWeek.value) {
        const today = new Date();
        currentWeek.value = today.toISOString().split("T")[0];
      }
    }
  };

  // Adicionar sessão de treino
  const addWorkoutSession = (workoutName: string, weekDay?: string) => {
    const session = createWorkoutSession(workoutName);

    // Se um dia da semana foi especificado, usar ele; senão usar o nome do treino
    if (weekDay) {
      session.dayName = weekDay;
    }

    // Garantir que a semana atual está inicializada
    initializeCurrentWeek();

    const weekProgress = getCurrentWeekProgress.value;

    if (weekProgress) {
      weekProgress.sessions.push(session);
      saveProgress();
    } else {
      console.error("weekProgress ainda não encontrado após inicialização");
    }
  };

  // Marcar dia como descanso
  const markDayAsRest = (weekDay: string) => {
    const session = createRestDaySession(weekDay);

    // Garantir que a semana atual está inicializada
    initializeCurrentWeek();

    const weekProgress = getCurrentWeekProgress.value;

    if (weekProgress) {
      weekProgress.sessions.push(session);
      saveProgress();
    } else {
      console.error("weekProgress ainda não encontrado após inicialização");
    }
  };

  // Deletar sessão
  const deleteSession = (sessionId: string) => {
    const weekProgress = getCurrentWeekProgress.value;
    if (weekProgress) {
      const sessionIndex = weekProgress.sessions.findIndex(
        (s) => s.id === sessionId
      );
      if (sessionIndex !== -1) {
        weekProgress.sessions.splice(sessionIndex, 1);
        saveProgress();
      }
    }
  };

  // Deletar sessão por dia da semana
  const deleteSessionByDay = (dayName: string) => {
    const weekProgress = getCurrentWeekProgress.value;
    if (weekProgress) {
      const sessionIndex = weekProgress.sessions.findIndex(
        (s) => s.dayName === dayName
      );
      if (sessionIndex !== -1) {
        weekProgress.sessions.splice(sessionIndex, 1);
        saveProgress();
      }
    }
  };

  // Limpar todas as sessões da semana atual
  const clearAllSessions = () => {
    const weekProgress = getCurrentWeekProgress.value;
    if (weekProgress) {
      weekProgress.sessions = [];
      saveProgress();
    }
  };

  // Marcar sessão como completa
  const completeWorkoutSession = (sessionId: string) => {
    const weekProgress = getCurrentWeekProgress.value;
    if (weekProgress) {
      const session = weekProgress.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.completed = true;
        saveProgress();
      }
    }
  };

  // Mapeamento de dias da semana para treinos (vazio para permitir escolha livre)
  const getWeeklySchedule = (): Record<string, string> => {
    return {};
  };

  // Obter estatísticas da semana
  const getWeeklyStats = computed(() => {
    const weekProgress = getCurrentWeekProgress.value;
    if (!weekProgress) return { total: 0, completed: 0, days: [] };

    const totalSessions = weekProgress.sessions.length;
    const completedSessions = weekProgress.sessions.filter(
      (s) => s.completed
    ).length;
    const days = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];

    const weeklySchedule = getWeeklySchedule();

    const dayStats = days.map((day) => {
      const session = weekProgress.sessions.find((s) => s.dayName === day);
      const scheduledWorkout = weeklySchedule[day];

      // Determinar o nome do treino baseado na sessão
      let sessionWorkoutName = "";
      if (session && !session.isRestDay) {
        // Se a sessão tem exercícios, usar o nome do primeiro exercício para identificar o treino
        if (session.exercises && session.exercises.length > 0) {
          const firstExercise = session.exercises[0].exerciseName;
          // Mapear exercícios para treinos baseado no arquivo de treinamento
          if (trainingData.value?.treino?.dias) {
            const matchingDay = trainingData.value.treino.dias.find((day) =>
              day.exercicios.some((ex) => ex.nome === firstExercise)
            );
            if (matchingDay) {
              sessionWorkoutName = matchingDay.nome;
            }
          }
        }
        // Se não conseguiu mapear, tentar usar o dayName se for um nome de treino válido
        if (!sessionWorkoutName && trainingData.value?.treino?.dias) {
          const validWorkoutNames = trainingData.value.treino.dias.map(
            (d) => d.nome
          );
          if (validWorkoutNames.includes(session.dayName)) {
            sessionWorkoutName = session.dayName;
          }
        }
        // Se ainda não conseguiu mapear, usar o dayName como fallback
        if (!sessionWorkoutName) {
          sessionWorkoutName = session.dayName;
        }
      }

      return {
        day,
        scheduledWorkout,
        hasSession: !!session,
        isRestDay: session?.isRestDay || false,
        completed: session?.completed || false,
        sessionWorkoutName,
      };
    });

    return {
      total: totalSessions,
      completed: completedSessions,
      days: dayStats,
    };
  });

  return {
    trainingData,
    weeklyProgress,
    currentWeek,
    loadTrainingData,
    getCurrentWeek,
    getCurrentWeekProgress,
    createWorkoutSession,
    createRestDaySession,
    addWorkoutSession,
    markDayAsRest,
    deleteSession,
    deleteSessionByDay,
    completeWorkoutSession,
    initializeCurrentWeek,
    loadProgress,
    saveProgress,
    getWeeklyStats,
    getWeeklySchedule,
    isLoading,
    clearAllSessions,
  };
};
