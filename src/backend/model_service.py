"""
model_service.py — Módulo de carga y predicción del modelo.

PUNTO DE INTEGRACIÓN CON MLFLOW:
    Actualmente carga un modelo local (.joblib).
    Cuando el compañero de MLflow entregue el modelo registrado,
    solo se necesita:
      1. Descomentar las líneas de MLflow
      2. Comentar la carga local
      3. Especificar el model_uri correcto
"""

import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

# ──────────────────────────────────────────────
# Configuración de rutas
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "logistic_a.joblib"

# ──────────────────────────────────────────────
# Carga del modelo
# ──────────────────────────────────────────────
_model = None


def get_model():
    """Retorna el modelo cargado (singleton)."""
    global _model
    if _model is None:
        _model = _load_model()
    return _model


def _load_model():
    """
    Carga el modelo desde disco o MLflow.

    ── OPCIÓN 1: Modelo local (activo por defecto) ──
    Se carga el pipeline serializado con joblib.

    ── OPCIÓN 2: Modelo desde MLflow (descomentar cuando esté listo) ──
    import mlflow
    model = mlflow.pyfunc.load_model("runs:/<RUN_ID>/model")
    # o bien:
    # model = mlflow.pyfunc.load_model("models:/<MODEL_NAME>/<VERSION>")
    return model
    """
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"No se encontró el modelo en {MODEL_PATH}. "
            "Ejecuta primero: python train_model.py"
        )
    model = joblib.load(MODEL_PATH)
    print(f"[model_service] Modelo cargado desde {MODEL_PATH}")
    return model


# ──────────────────────────────────────────────
# Columnas del Modelo A (16 variables, incluye ideación suicida)
# ──────────────────────────────────────────────
MODEL_A_COLUMNS = [
    "Gender",
    "Age",
    "City",
    "Profession",
    "Academic Pressure",
    "Work Pressure",
    "CGPA",
    "Study Satisfaction",
    "Job Satisfaction",
    "Sleep Duration",
    "Dietary Habits",
    "Degree",
    "Have you ever had suicidal thoughts ?",
    "Work/Study Hours",
    "Financial Stress",
    "Family History of Mental Illness",
]


def predict_single(student_data: dict) -> dict:
    """
    Realiza una predicción para un solo estudiante.

    Args:
        student_data: diccionario con las variables del modelo A.

    Returns:
        dict con probability, risk_level, risk_label, contributing_factors.
    """
    model = get_model()

    df = pd.DataFrame([student_data])

    for col in MODEL_A_COLUMNS:
        if col not in df.columns:
            raise ValueError(f"Falta la columna requerida: {col}")

    df = df[MODEL_A_COLUMNS]

    probability = float(model.predict_proba(df)[0][1]) * 100
    prediction = int(model.predict(df)[0])

    risk_level, risk_label = _classify_risk(probability)

    factors = _get_contributing_factors(student_data, probability)

    return {
        "probability": round(probability, 1),
        "prediction": prediction,
        "risk_level": risk_level,
        "risk_label": risk_label,
        "contributing_factors": factors,
    }


def predict_batch(df: pd.DataFrame) -> pd.DataFrame:
    """
    Realiza predicciones para un DataFrame completo.

    Args:
        df: DataFrame con las columnas del modelo A.

    Returns:
        DataFrame original con columnas adicionales:
        probability, prediction, risk_level, risk_label.
    """
    model = get_model()

    X = df[MODEL_A_COLUMNS].copy()

    probabilities = model.predict_proba(X)[:, 1] * 100
    predictions = model.predict(X)

    df = df.copy()
    df["probability"] = np.round(probabilities, 1)
    df["prediction"] = predictions
    df["risk_level"] = df["probability"].apply(lambda p: _classify_risk(p)[0])
    df["risk_label"] = df["probability"].apply(lambda p: _classify_risk(p)[1])

    return df


def _classify_risk(probability: float) -> tuple:
    """Clasifica el nivel de riesgo según la probabilidad."""
    if probability >= 70:
        return ("high", "RIESGO ALTO")
    elif probability >= 40:
        return ("medium", "RIESGO MODERADO")
    else:
        return ("low", "RIESGO BAJO")


def _get_contributing_factors(data: dict, probability: float) -> list:
    """Identifica los factores que contribuyen al riesgo."""
    factors = []

    cgpa = float(data.get("CGPA", 5))
    if cgpa < 4.0:
        factors.append("Promedio académico bajo (CGPA)")

    sleep = str(data.get("Sleep Duration", ""))
    if "less than 5" in sleep.lower() or "< 5" in sleep.lower():
        factors.append("Sueño insuficiente (menos de 5 horas)")
    elif "5-6" in sleep:
        factors.append("Sueño reducido (5-6 horas)")

    pressure = float(data.get("Academic Pressure", 0))
    if pressure >= 4:
        factors.append("Alta presión académica")

    financial = float(data.get("Financial Stress", 0))
    if financial >= 4:
        factors.append("Alto estrés financiero")

    work_hours = float(data.get("Work/Study Hours", 0))
    if work_hours >= 8:
        factors.append("Excesivas horas de trabajo/estudio")

    study_sat = float(data.get("Study Satisfaction", 5))
    if study_sat <= 2:
        factors.append("Baja satisfacción con los estudios")

    diet = str(data.get("Dietary Habits", ""))
    if diet.lower() == "unhealthy":
        factors.append("Hábitos alimentarios poco saludables")

    family = str(data.get("Family History of Mental Illness", ""))
    if family.lower() == "yes":
        factors.append("Antecedentes familiares de enfermedad mental")

    return factors
