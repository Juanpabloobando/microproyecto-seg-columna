"""
main.py — API FastAPI para el Sistema Predictivo de Riesgo Depresivo.

Endpoints:
    POST /api/predict       — Predicción individual de riesgo
    GET  /api/students      — Lista de estudiantes con riesgo precalculado
    GET  /api/analytics     — Estadísticas agregadas del dataset
    GET  /api/health        — Health check
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import pandas as pd
import numpy as np
from pathlib import Path

from model_service import predict_single, predict_batch, MODEL_B_COLUMNS, get_model

# ──────────────────────────────────────────────
# Configuración
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent.parent
DATA_PATH = PROJECT_DIR / "data" / "student_depression.csv"

app = FastAPI(
    title="Sistema Predictivo de Riesgo Depresivo",
    description="API para predicción de riesgo de depresión en estudiantes universitarios",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Cache del dataset
# ──────────────────────────────────────────────
_df_cache = None
_df_predicted_cache = None


def _load_dataset() -> pd.DataFrame:
    global _df_cache
    if _df_cache is None:
        if not DATA_PATH.exists():
            raise FileNotFoundError(f"Dataset no encontrado en {DATA_PATH}")
        _df_cache = pd.read_csv(DATA_PATH)
        if "Sleep Duration" in _df_cache.columns:
            _df_cache["Sleep Duration"] = _df_cache["Sleep Duration"].str.replace("'", "", regex=False)
    return _df_cache


def _get_predicted_dataset() -> pd.DataFrame:
    global _df_predicted_cache
    if _df_predicted_cache is None:
        df = _load_dataset().copy()
        cols_to_drop = ["id", "Depression", "Have you ever had suicidal thoughts ?"]
        X = df.drop(columns=[c for c in cols_to_drop if c in df.columns])
        _df_predicted_cache = predict_batch(X)
        _df_predicted_cache["id"] = df["id"]
        _df_predicted_cache["Depression_actual"] = df["Depression"]
    return _df_predicted_cache


# ──────────────────────────────────────────────
# Schemas
# ──────────────────────────────────────────────
class StudentInput(BaseModel):
    Gender: str
    Age: float
    City: str
    Profession: str
    Academic_Pressure: float = Field(alias="Academic Pressure")
    Work_Pressure: float = Field(alias="Work Pressure")
    CGPA: float
    Study_Satisfaction: float = Field(alias="Study Satisfaction")
    Job_Satisfaction: float = Field(alias="Job Satisfaction")
    Sleep_Duration: str = Field(alias="Sleep Duration")
    Dietary_Habits: str = Field(alias="Dietary Habits")
    Degree: str
    Work_Study_Hours: float = Field(alias="Work/Study Hours")
    Financial_Stress: str = Field(alias="Financial Stress")
    Family_History: str = Field(alias="Family History of Mental Illness")

    model_config = {"populate_by_name": True}


class PredictionResponse(BaseModel):
    probability: float
    prediction: int
    risk_level: str
    risk_label: str
    contributing_factors: list[str]


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    """Verifica que la API y el modelo estén funcionando."""
    try:
        get_model()
        return {"status": "ok", "model_loaded": True}
    except Exception as e:
        return {"status": "error", "model_loaded": False, "detail": str(e)}


@app.post("/api/predict", response_model=PredictionResponse)
def predict(student: StudentInput):
    """Realiza una predicción de riesgo para un estudiante individual."""
    try:
        data = {
            "Gender": student.Gender,
            "Age": student.Age,
            "City": student.City,
            "Profession": student.Profession,
            "Academic Pressure": student.Academic_Pressure,
            "Work Pressure": student.Work_Pressure,
            "CGPA": student.CGPA,
            "Study Satisfaction": student.Study_Satisfaction,
            "Job Satisfaction": student.Job_Satisfaction,
            "Sleep Duration": student.Sleep_Duration,
            "Dietary Habits": student.Dietary_Habits,
            "Degree": student.Degree,
            "Work/Study Hours": student.Work_Study_Hours,
            "Financial Stress": str(student.Financial_Stress),
            "Family History of Mental Illness": student.Family_History,
        }
        result = predict_single(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/students")
def get_students(
    search: Optional[str] = None,
    risk_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
):
    """
    Retorna la lista de estudiantes con su predicción de riesgo.

    Query params:
        search: Buscar por ID
        risk_filter: 'low', 'medium', 'high' o 'all'
        page: Número de página (1-indexed)
        page_size: Registros por página
    """
    try:
        df = _get_predicted_dataset()

        if search:
            df = df[df["id"].astype(str).str.contains(search, case=False)]

        if risk_filter and risk_filter != "all":
            df = df[df["risk_level"] == risk_filter]

        total = len(df)
        start = (page - 1) * page_size
        end = start + page_size
        page_df = df.iloc[start:end]

        students = []
        for _, row in page_df.iterrows():
            students.append({
                "id": str(int(row["id"])) if pd.notna(row.get("id")) else "",
                "gender": row.get("Gender", ""),
                "age": float(row.get("Age", 0)),
                "city": row.get("City", ""),
                "profession": row.get("Profession", ""),
                "degree": row.get("Degree", ""),
                "cgpa": float(row.get("CGPA", 0)),
                "sleep_duration": row.get("Sleep Duration", ""),
                "academic_pressure": float(row.get("Academic Pressure", 0)),
                "financial_stress": float(row.get("Financial Stress", 0)),
                "dietary_habits": row.get("Dietary Habits", ""),
                "family_history": row.get("Family History of Mental Illness", ""),
                "work_study_hours": float(row.get("Work/Study Hours", 0)),
                "probability": float(row.get("probability", 0)),
                "risk_level": row.get("risk_level", "low"),
                "risk_label": row.get("risk_label", ""),
                "depression_actual": int(row.get("Depression_actual", 0)),
            })

        stats = {
            "total": total,
            "high_risk": int((df["risk_level"] == "high").sum()),
            "medium_risk": int((df["risk_level"] == "medium").sum()),
            "low_risk": int((df["risk_level"] == "low").sum()),
        }

        return {
            "students": students,
            "stats": stats,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/analytics")
def get_analytics():
    """Retorna estadísticas agregadas para el panel de análisis."""
    try:
        df = _get_predicted_dataset()
        raw_df = _load_dataset()

        # ── Riesgo por carrera (Degree) ──
        risk_by_degree = []
        for degree, group in df.groupby("Degree"):
            total = len(group)
            if total < 10:
                continue
            risk_by_degree.append({
                "degree": degree,
                "low": int((group["risk_level"] == "low").sum()),
                "medium": int((group["risk_level"] == "medium").sum()),
                "high": int((group["risk_level"] == "high").sum()),
                "total": total,
                "high_pct": round((group["risk_level"] == "high").sum() / total * 100, 1),
            })
        risk_by_degree.sort(key=lambda x: x["high_pct"], reverse=True)

        # ── Distribución de riesgo general ──
        risk_distribution = {
            "low": int((df["risk_level"] == "low").sum()),
            "medium": int((df["risk_level"] == "medium").sum()),
            "high": int((df["risk_level"] == "high").sum()),
        }
        total_students = len(df)

        # ── Promedio de probabilidad ──
        avg_probability = round(float(df["probability"].mean()), 1)

        # ── Factores contribuyentes (basado en datos reales) ──
        factors = []

        sleep_risk = raw_df[raw_df["Sleep Duration"].str.contains("Less than 5|less than 5", case=False, na=False)]
        factors.append({
            "name": "Sueño Insuficiente",
            "value": len(sleep_risk),
            "pct": round(len(sleep_risk) / total_students * 100, 1),
        })

        high_financial = raw_df[pd.to_numeric(raw_df["Financial Stress"], errors="coerce") >= 4]
        factors.append({
            "name": "Estrés Financiero Alto",
            "value": len(high_financial),
            "pct": round(len(high_financial) / total_students * 100, 1),
        })

        high_pressure = raw_df[raw_df["Academic Pressure"] >= 4]
        factors.append({
            "name": "Presión Académica Alta",
            "value": len(high_pressure),
            "pct": round(len(high_pressure) / total_students * 100, 1),
        })

        low_cgpa = raw_df[raw_df["CGPA"] < 4.0]
        factors.append({
            "name": "CGPA Bajo",
            "value": len(low_cgpa),
            "pct": round(len(low_cgpa) / total_students * 100, 1),
        })

        factors.sort(key=lambda x: x["value"], reverse=True)

        # ── Riesgo por presión académica ──
        risk_by_pressure = []
        for pressure, group in df.groupby("Academic Pressure"):
            total = len(group)
            risk_by_pressure.append({
                "pressure": int(pressure),
                "depression_rate": round(
                    group["Depression_actual"].mean() * 100, 1
                ),
                "avg_probability": round(float(group["probability"].mean()), 1),
                "count": total,
            })

        # ── Riesgo por sueño ──
        risk_by_sleep = []
        for sleep, group in df.groupby("Sleep Duration"):
            total = len(group)
            if total < 5:
                continue
            risk_by_sleep.append({
                "sleep_duration": sleep,
                "depression_rate": round(
                    group["Depression_actual"].mean() * 100, 1
                ),
                "avg_probability": round(float(group["probability"].mean()), 1),
                "count": total,
            })

        # ── Top estudiantes en riesgo ──
        top_risk = df.nlargest(10, "probability")
        alerts = []
        for _, row in top_risk.iterrows():
            main_factor = ""
            if float(row.get("Academic Pressure", 0)) >= 4:
                main_factor = "Alta presión académica"
            elif float(row.get("Financial Stress", 0)) >= 4:
                main_factor = "Alto estrés financiero"
            elif "less than 5" in str(row.get("Sleep Duration", "")).lower():
                main_factor = "Sueño insuficiente"
            else:
                main_factor = f"CGPA: {row.get('CGPA', 'N/A')}"

            alerts.append({
                "id": str(int(row["id"])) if pd.notna(row.get("id")) else "",
                "degree": row.get("Degree", ""),
                "probability": float(row["probability"]),
                "risk_level": row["risk_level"],
                "main_factor": main_factor,
            })

        return {
            "total_students": total_students,
            "avg_probability": avg_probability,
            "risk_distribution": risk_distribution,
            "risk_by_degree": risk_by_degree[:10],
            "contributing_factors": factors,
            "risk_by_pressure": risk_by_pressure,
            "risk_by_sleep": risk_by_sleep,
            "recent_alerts": alerts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dataset/columns")
def get_dataset_columns():
    """Retorna los valores únicos de las columnas categóricas para el formulario."""
    try:
        df = _load_dataset()
        return {
            "cities": sorted(df["City"].dropna().unique().tolist()),
            "professions": sorted(df["Profession"].dropna().unique().tolist()),
            "degrees": sorted(df["Degree"].dropna().unique().tolist()),
            "sleep_durations": sorted(df["Sleep Duration"].dropna().unique().tolist()),
            "dietary_habits": sorted(df["Dietary Habits"].dropna().unique().tolist()),
            "genders": sorted(df["Gender"].dropna().unique().tolist()),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
