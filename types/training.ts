export interface Exercise {
  nome: string;
  reps: string;
  cadencia: string;
  descanso: string;
  numero_series: number;
}

export interface TrainingDay {
  nome: string;
  grupo_muscular: string[];
  exercicios: Exercise[];
}

export interface TrainingPrinciples {
  cadencia: string;
  carga: string;
  descanso: string;
}

export interface TrainingData {
  treino: {
    principios_gerais: TrainingPrinciples;
    dias: TrainingDay[];
  };
}

export interface WorkoutSession {
  id: string;
  date: string;
  dayName: string;
  completed: boolean;
  isRestDay?: boolean;
  exercises: {
    exerciseName: string;
    sets: {
      reps: number;
      weight?: number;
      completed: boolean;
    }[];
  }[];
}

export interface WeeklyProgress {
  weekStart: string; // Monday of the week
  sessions: WorkoutSession[];
}
