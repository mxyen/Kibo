export type ClassSummary = {
  id: string;
  name: string;
  subject: string;
  code: string;
  students: number;
  average: number;
  color: string;
};

export const mockClasses: ClassSummary[] = [
  {
    id: "mat-a3",
    name: "Matemáticas A3",
    subject: "Matemáticas",
    code: "ABC123",
    students: 30,
    average: 82,
    color: "var(--color-primary)",
  },
  {
    id: "cie-b1",
    name: "Ciencias B1",
    subject: "Ciencias Naturales",
    code: "SCI901",
    students: 26,
    average: 76,
    color: "var(--color-secondary)",
  },
  {
    id: "leng-c2",
    name: "Lenguaje C2",
    subject: "Comunicación",
    code: "LEN482",
    students: 24,
    average: 88,
    color: "#16a34a",
  },
];

export type TopicMastery = {
  topic: string;
  mastery: number;
  status: "refuerzo" | "progreso" | "dominado";
};

export const mockTopicMastery: TopicMastery[] = [
  { topic: "Vectores", mastery: 38, status: "refuerzo" },
  { topic: "Fracciones", mastery: 52, status: "refuerzo" },
  { topic: "Álgebra", mastery: 91, status: "dominado" },
  { topic: "Geometría", mastery: 74, status: "progreso" },
];

export const mockGemmaInsights = [
  "8 alumnos tienen problemas con vectores.",
  "5 alumnos presentan dificultades con fracciones.",
  "El grupo aprende mejor mediante ejemplos visuales.",
];

export const mockRecommendations = [
  "Reforzar vectores con ejercicios gráficos interactivos.",
  "Introducir fracciones usando analogías visuales (pizzas, barras).",
  "Mantener el ritmo actual en álgebra con retos avanzados.",
];

export type ActivityQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  topic: string;
};

export const mockActivity: ActivityQuestion = {
  id: "act-1",
  topic: "Fracciones",
  prompt: "¿Cuál es el resultado de sumar 1/4 + 1/2?",
  choices: ["1/6", "3/4", "2/6", "1/2"],
  answerIndex: 1,
};

export const mockStudentProgress = {
  name: "Kibo",
  xp: 1240,
  xpToNextLevel: 2000,
  level: 5,
  streak: 6,
  missions: [
    { id: "m1", label: "Completa 3 ejercicios de fracciones", done: true },
    { id: "m2", label: "Practica vectores 10 minutos", done: false },
    { id: "m3", label: "Habla con KIBO sobre álgebra", done: false },
  ],
};

export const mockAnalytics = {
  weeklyActivity: [40, 65, 52, 80, 71, 90, 58],
  topicsBreakdown: mockTopicMastery,
  engagementScore: 87,
};
