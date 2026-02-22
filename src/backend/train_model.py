"""
train_model.py — Entrena y serializa el modelo Logistic Regression A.

Modelo A: Incluye todas las 16 variables predictoras
(incluyendo ideación suicida). Mejor F1=0.867 según MLflow.

Uso:
    python train_model.py

Genera:
    backend/models/logistic_a.joblib
"""

import os
import sys
import pandas as pd
import numpy as np
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, f1_score
import joblib

# ──────────────────────────────────────────────
# Rutas
# ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent.parent
DATA_PATH = PROJECT_DIR / "data" / "student_depression.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "logistic_a.joblib"


def main():
    print("=" * 60)
    print("  Entrenamiento del Modelo Logistic Regression A")
    print("  (16 variables — incluye ideación suicida)")
    print("=" * 60)

    # ── 1. Cargar datos ──
    if not DATA_PATH.exists():
        print(f"\n[ERROR] No se encontró el dataset en: {DATA_PATH}")
        print("Asegúrate de que 'student_depression.csv' esté en la carpeta 'data/'")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    print(f"\nDataset cargado: {df.shape[0]} registros, {df.shape[1]} columnas")

    # ── 2. Limpiar columna Sleep Duration (quitar comilla al final) ──
    if "Sleep Duration" in df.columns:
        df["Sleep Duration"] = df["Sleep Duration"].str.replace("'", "", regex=False)

    # ── 3. Separar variables ──
    y = df["Depression"]

    columns_to_drop = ["id", "Depression"]
    X = df.drop(columns=[c for c in columns_to_drop if c in df.columns])

    print(f"Variables predictoras (Modelo A): {list(X.columns)}")
    print(f"Variable objetivo: Depression (0=No, 1=Sí)")
    print(f"Distribución: {dict(y.value_counts())}")

    # ── 4. Split train/test ──
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain: {X_train.shape[0]} | Test: {X_test.shape[0]}")

    # ── 5. Construir pipeline ──
    num_cols = X_train.select_dtypes(include=["int64", "float64"]).columns.tolist()
    cat_cols = X_train.select_dtypes(include=["object"]).columns.tolist()

    print(f"Numéricas ({len(num_cols)}): {num_cols}")
    print(f"Categóricas ({len(cat_cols)}): {cat_cols}")

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), num_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ]
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000, random_state=42)),
        ]
    )

    # ── 6. Entrenar ──
    print("\nEntrenando modelo...")
    model.fit(X_train, y_train)

    # ── 7. Evaluar ──
    y_pred = model.predict(X_test)
    print("\n" + "=" * 40)
    print("  RESULTADOS - Logistic Regression A")
    print("=" * 40)
    print(classification_report(y_test, y_pred, target_names=["No Depresión", "Depresión"]))
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"F1-Score: {f1_score(y_test, y_pred):.4f}")

    # ── 8. Guardar modelo ──
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nModelo guardado en: {MODEL_PATH}")
    print(f"Tamaño: {MODEL_PATH.stat().st_size / 1024:.1f} KB")
    print("\n¡Listo! Ahora puedes iniciar el servidor con:")
    print("  uvicorn main:app --reload")


if __name__ == "__main__":
    main()
