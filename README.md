# Sistema Predictivo de Riesgo Depresivo en Estudiantes Universitarios

Sistema de alerta temprana que utiliza modelos de Machine Learning para estimar el riesgo de depresión en estudiantes universitarios, basado en variables académicas, demográficas y de estilo de vida.

## Arquitectura

```
microproyecto-depresion/
├── backend/          # API FastAPI + modelo ML
│   ├── main.py       # Endpoints: /api/predict, /api/students, /api/analytics
│   ├── model_service.py  # Carga del modelo (local o MLflow)
│   ├── train_model.py    # Script de entrenamiento
│   └── requirements.txt
├── frontend/         # React + Vite + TypeScript + TailwindCSS + shadcn/ui
│   ├── src/
│   │   ├── api/client.ts  # Cliente API
│   │   ├── views/         # Dashboard, Estudiantes, Análisis, Configuración
│   │   └── components/    # Componentes reutilizables
│   └── package.json
├── data/
│   └── student_depression.csv
└── README.md
```

## Requisitos

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

## Instalación y Ejecución

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python train_model.py       # Entrena y guarda el modelo
uvicorn main:app --reload   # Inicia la API en http://127.0.0.1:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # Inicia el frontend en http://localhost:5173
```

### 3. Abrir en el navegador

Ir a **http://localhost:5173**

## Modelo

Se utiliza **Regresión Logística (Modelo B)** — sin la variable de ideación suicida para mantener un enfoque preventivo y no diagnóstico.

- **Accuracy**: ~0.80
- **F1-Score**: ~0.83
- **Recall**: ~0.85

### Variables del modelo

| Variable | Tipo |
|---|---|
| Gender | Categórica |
| Age | Numérica |
| City | Categórica |
| Profession | Categórica |
| Academic Pressure | Numérica (1-5) |
| Work Pressure | Numérica |
| CGPA | Numérica (0-10) |
| Study Satisfaction | Numérica (1-5) |
| Job Satisfaction | Numérica |
| Sleep Duration | Categórica |
| Dietary Habits | Categórica |
| Degree | Categórica |
| Work/Study Hours | Numérica |
| Financial Stress | Numérica (1-5) |
| Family History of Mental Illness | Categórica |

## Integración con MLflow

El archivo `backend/model_service.py` contiene un punto de integración preparado para cargar modelos desde MLflow:

```python
# OPCIÓN 1: Modelo local (activo por defecto)
model = joblib.load("models/logistic_b.joblib")

# OPCIÓN 2: Modelo desde MLflow (descomentar cuando esté listo)
# import mlflow
# model = mlflow.pyfunc.load_model("runs:/<RUN_ID>/model")
```

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/predict` | Predicción individual de riesgo |
| GET | `/api/students` | Lista de estudiantes con predicción |
| GET | `/api/analytics` | Estadísticas agregadas |
| GET | `/api/dataset/columns` | Valores únicos para formulario |

## Dataset

**Student Depression Dataset** — 27,901 registros, 18 variables.
Fuente: [Kaggle](https://www.kaggle.com)

## Equipo

- Diana Lorena Giraldo Arboleda
- Elvis Raúl Hernández Cáceres
- Julián David Florido González
- Juan Pablo Obando Álvarez

Universidad de los Andes — 2026
