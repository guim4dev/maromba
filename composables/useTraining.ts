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

      console.log("=== INICIANDO LOAD TRAINING DATA ===");
      console.log("URL:", url);

      // 1st attempt: fetch with timeout
      try {
        console.log(
          "Carregando dados de treinamento (tentando fetch com timeout)..."
        );
        data = await fetchWithTimeout<TrainingData>(url, 3000);
        triedFetch = true;
        console.log("Dados carregados via fetch:", data);
        console.log("Estrutura dos dados:", {
          hasTreino: !!data.treino,
          hasDias: !!data.treino?.dias,
          diasLength: data.treino?.dias?.length,
          diasNomes: data.treino?.dias?.map((d) => d.nome),
        });

        if (!data.treino || !data.treino.dias) {
          throw new Error(
            "Formato de dados inválido: estrutura treino.dias não encontrada"
          );
        }

        trainingData.value = data;
        saveTrainingDataToCache(data);
        console.log(
          "Dados de treinamento carregados com sucesso e salvos no cache:",
          trainingData.value
        );
        console.log("trainingData.value após atribuição:", {
          hasTreino: !!trainingData.value?.treino,
          hasDias: !!trainingData.value?.treino?.dias,
          diasLength: trainingData.value?.treino?.dias?.length,
          diasNomes: trainingData.value?.treino?.dias?.map((d) => d.nome),
        });
        return;
      } catch (error) {
        console.warn("Fetch falhou ou demorou demais:", error);
      }

      // 2nd attempt: load from cache
      try {
        console.log("Tentando carregar dados do cache localStorage...");
        data = loadTrainingDataFromCache();
        triedCache = true;
        console.log("Dados do cache:", data);
        if (data && data.treino && data.treino.dias) {
          trainingData.value = data;
          console.log("Dados carregados do cache:", trainingData.value);
          console.log("Estrutura dos dados do cache:", {
            hasTreino: !!trainingData.value?.treino,
            hasDias: !!trainingData.value?.treino?.dias,
            diasLength: trainingData.value?.treino?.dias?.length,
            diasNomes: trainingData.value?.treino?.dias?.map((d) => d.nome),
          });
          return;
        } else {
          console.log("Cache inválido ou vazio, tentando fetch novamente");
        }
      } catch (error) {
        console.warn("Erro ao carregar do cache:", error);
      }

      // 3rd attempt: retry fetch (sem timeout)
      if (!triedFetch) {
        try {
          console.log("Tentando fetch novamente (sem timeout)...");
          data = await $fetch<TrainingData>(url);
          if (!data.treino || !data.treino.dias) {
            throw new Error(
              "Formato de dados inválido: estrutura treino.dias não encontrada"
            );
          }
          trainingData.value = data;
          saveTrainingDataToCache(data);
          console.log(
            "Dados de treinamento carregados com sucesso na segunda tentativa e salvos no cache:",
            trainingData.value
          );
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
    // Converter para timezone do Brasil (UTC-3)
    const brazilTime = new Date(
      date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    );

    if (isNaN(brazilTime.getTime())) {
      // Fallback para data atual no timezone do Brasil
      const now = new Date();
      const brazilNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );
      brazilTime.setTime(brazilNow.getTime());
    }

    const day = brazilTime.getDay();
    // getDay() retorna: 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado
    // Queremos que segunda-feira seja o início da semana
    const daysToSubtract = day === 0 ? 6 : day - 1;
    brazilTime.setDate(brazilTime.getDate() - daysToSubtract);

    console.log("getWeekStart debug:", {
      originalDate: date.toISOString().split("T")[0],
      brazilDate: brazilTime.toISOString().split("T")[0],
      dayOfWeek: day,
      daysToSubtract,
    });

    // Retornar no formato YYYY-MM-DD
    const year = brazilTime.getFullYear();
    const month = String(brazilTime.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(brazilTime.getDate()).padStart(2, "0");
    return `${year}-${month}-${dayOfMonth}`;
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
    console.log("createWorkoutSession chamada com dayName:", dayName);
    console.log("trainingData.value:", trainingData.value);

    const day = trainingData.value?.treino.dias.find((d) => d.nome === dayName);
    console.log("dia encontrado:", day);

    if (!day) {
      console.error("Dia de treino não encontrado para:", dayName);
      console.log(
        "Dias disponíveis:",
        trainingData.value?.treino.dias?.map((d) => d.nome)
      );
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

    console.log("Sessão criada:", session);
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

    console.log("Sessão de descanso criada:", session);
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
    console.log(
      "addWorkoutSession chamada com workoutName:",
      workoutName,
      "weekDay:",
      weekDay
    );
    console.log("currentWeek.value:", currentWeek.value);
    console.log("getCurrentWeekProgress.value:", getCurrentWeekProgress.value);

    const session = createWorkoutSession(workoutName);
    console.log("Sessão criada:", session);

    // Se um dia da semana foi especificado, usar ele; senão usar o nome do treino
    if (weekDay) {
      session.dayName = weekDay;
    }

    // Garantir que a semana atual está inicializada
    initializeCurrentWeek();

    const weekProgress = getCurrentWeekProgress.value;
    console.log("weekProgress encontrado:", weekProgress);

    if (weekProgress) {
      weekProgress.sessions.push(session);
      console.log("Sessão adicionada ao weekProgress");
      saveProgress();
      console.log("Progresso salvo");
    } else {
      console.error("weekProgress ainda não encontrado após inicialização");
    }
  };

  // Marcar dia como descanso
  const markDayAsRest = (weekDay: string) => {
    console.log("markDayAsRest chamada com weekDay:", weekDay);

    const session = createRestDaySession(weekDay);
    console.log("Sessão de descanso criada:", session);

    // Garantir que a semana atual está inicializada
    initializeCurrentWeek();

    const weekProgress = getCurrentWeekProgress.value;
    console.log("weekProgress encontrado:", weekProgress);

    if (weekProgress) {
      weekProgress.sessions.push(session);
      console.log("Sessão de descanso adicionada ao weekProgress");
      saveProgress();
      console.log("Progresso salvo");
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
        console.log("Sessão deletada:", sessionId);
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
        console.log("Sessão deletada para o dia:", dayName);
      }
    }
  };

  // Limpar todas as sessões da semana atual
  const clearAllSessions = () => {
    const weekProgress = getCurrentWeekProgress.value;
    if (weekProgress) {
      weekProgress.sessions = [];
      saveProgress();
      console.log("Todas as sessões da semana atual foram limpas");
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
