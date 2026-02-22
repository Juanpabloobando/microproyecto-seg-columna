/**
 * client.ts — Cliente API para comunicarse con el backend FastAPI.
 *
 * Todas las llamadas al backend pasan por aquí.
 * La URL base se configura automáticamente via el proxy de Vite.
 */

const API_BASE = "/api";

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────
export interface StudentInput {
  Gender: string;
  Age: number;
  City: string;
  Profession: string;
  "Academic Pressure": number;
  "Work Pressure": number;
  CGPA: number;
  "Study Satisfaction": number;
  "Job Satisfaction": number;
  "Sleep Duration": string;
  "Dietary Habits": string;
  Degree: string;
  "Work/Study Hours": number;
  "Financial Stress": number;
  "Family History of Mental Illness": string;
  "Have you ever had suicidal thoughts ?": string;
}

export interface PredictionResult {
  probability: number;
  prediction: number;
  risk_level: "low" | "medium" | "high";
  risk_label: string;
  contributing_factors: string[];
}

export interface StudentRecord {
  id: string;
  gender: string;
  age: number;
  city: string;
  profession: string;
  degree: string;
  cgpa: number;
  sleep_duration: string;
  academic_pressure: number;
  financial_stress: number;
  dietary_habits: string;
  family_history: string;
  work_study_hours: number;
  probability: number;
  risk_level: "low" | "medium" | "high";
  risk_label: string;
  depression_actual: number;
}

export interface StudentsResponse {
  students: StudentRecord[];
  stats: {
    total: number;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RiskByDegree {
  degree: string;
  low: number;
  medium: number;
  high: number;
  total: number;
  high_pct: number;
}

export interface ContributingFactor {
  name: string;
  value: number;
  pct: number;
}

export interface RiskByPressure {
  pressure: number;
  depression_rate: number;
  avg_probability: number;
  count: number;
}

export interface RiskBySleep {
  sleep_duration: string;
  depression_rate: number;
  avg_probability: number;
  count: number;
}

export interface AlertRecord {
  id: string;
  degree: string;
  probability: number;
  risk_level: string;
  main_factor: string;
}

export interface AnalyticsResponse {
  total_students: number;
  avg_probability: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  risk_by_degree: RiskByDegree[];
  contributing_factors: ContributingFactor[];
  risk_by_pressure: RiskByPressure[];
  risk_by_sleep: RiskBySleep[];
  recent_alerts: AlertRecord[];
}

export interface DatasetColumns {
  cities: string[];
  professions: string[];
  degrees: string[];
  sleep_durations: string[];
  dietary_habits: string[];
  genders: string[];
}

// ──────────────────────────────────────────────
// Funciones API
// ──────────────────────────────────────────────

export async function predictRisk(
  data: StudentInput
): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al realizar la predicción");
  }
  return res.json();
}

export async function getStudents(params?: {
  search?: string;
  risk_filter?: string;
  page?: number;
  page_size?: number;
}): Promise<StudentsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.risk_filter) searchParams.set("risk_filter", params.risk_filter);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.page_size)
    searchParams.set("page_size", String(params.page_size));

  const url = `${API_BASE}/students?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al obtener estudiantes");
  }
  return res.json();
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al obtener analíticas");
  }
  return res.json();
}

export async function getDatasetColumns(): Promise<DatasetColumns> {
  const res = await fetch(`${API_BASE}/dataset/columns`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al obtener columnas del dataset");
  }
  return res.json();
}

export async function healthCheck(): Promise<{
  status: string;
  model_loaded: boolean;
}> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
