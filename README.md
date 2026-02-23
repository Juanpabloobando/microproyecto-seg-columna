# Sistema Predictivo de Riesgo Depresivo en Estudiantes Universitarios

Sistema de alerta temprana que utiliza Machine Learning para estimar el riesgo de depresión en estudiantes universitarios, basado en variables académicas, demográficas y de estilo de vida.

## Estructura del repositorio

```
├── data/
│   └── student_depression.csv          # Dataset (27,901 registros)
├── notebooks/
│   ├── Exploracion_de_datos_del_microproyecto.ipynb  # EDA
│   └── Modelo final.ipynb              # Entrenamiento + MLflow (6 modelos)
├── src/
│   ├── backend/                        # API FastAPI + modelo ML
│   │   ├── main.py                     # Endpoints REST
│   │   ├── model_service.py            # Carga y predicción del modelo
│   │   ├── train_model.py              # Script de entrenamiento
│   │   └── requirements.txt
│   └── frontend/                       # React + Vite + TailwindCSS + shadcn/ui
│       ├── src/views/                  # Dashboard, Estudiantes, Análisis
│       ├── src/api/client.ts           # Cliente API
│       └── package.json
└── README.md
```

## Requisitos

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

## Reproducir el proyecto (paso a paso)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juanpabloobando/microproyecto-seg-columna.git
cd microproyecto-seg-columna
```

### 2. Backend — Instalar dependencias, entrenar modelo e iniciar API

```bash
cd src/backend
pip install -r requirements.txt
python train_model.py
python -m uvicorn main:app --reload
```

El script `train_model.py` lee el CSV desde `data/`, entrena el modelo y lo guarda en `src/backend/models/logistic_a.joblib`. La API queda disponible en **http://127.0.0.1:8000**.

### 3. Frontend — Instalar dependencias e iniciar

```bash
cd src/frontend
npm install
npm run dev
```

El frontend queda disponible en **http://localhost:5173** y se conecta automáticamente al backend mediante un proxy configurado en Vite.

### 4. Abrir en el navegador

Ir a **http://localhost:5173**

## Modelo seleccionado: Logistic Regression A

Se evaluaron 6 configuraciones en MLflow (3 algoritmos × 2 datasets):

| Modelo | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| **Logistic_A** ✅ | **0.843** | **0.858** | **0.877** | **0.867** |
| XGB_A | 0.841 | 0.856 | 0.877 | 0.866 |
| RF_A | 0.838 | 0.847 | 0.883 | 0.865 |
| XGB_B | 0.798 | 0.814 | 0.849 | 0.831 |
| Logistic_B | 0.796 | 0.813 | 0.848 | 0.830 |
| RF_B | 0.792 | 0.805 | 0.851 | 0.828 |

**Logistic Regression A** obtuvo el mejor F1-Score (0.867) incluyendo las 16 variables predictoras. Los modelos "A" incluyen la variable de ideación suicida; los "B" la excluyen.

### Variables del modelo (16)

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
| Have you ever had suicidal thoughts ? | Categórica (Yes/No) |
| Work/Study Hours | Numérica |
| Financial Stress | Categórica (1-5) |
| Family History of Mental Illness | Categórica (Yes/No) |

## Experimentos MLflow

Los 6 modelos fueron registrados en MLflow con el experimento `Proyecto_Depresion_Entrega2`. El notebook `notebooks/Modelo final.ipynb` contiene el código completo de entrenamiento y registro.

Servidor MLflow: `http://3.94.195.217:8050`

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Health check + estado del modelo |
| POST | `/api/predict` | Predicción individual de riesgo |
| GET | `/api/students` | Lista paginada de estudiantes con predicción |
| GET | `/api/analytics` | Estadísticas agregadas para el panel de análisis |
| GET | `/api/dataset/columns` | Valores únicos para dropdowns del formulario |

## Dataset

**Student Depression Dataset** — 27,901 registros, 18 variables.
Fuente: [Kaggle](https://www.kaggle.com/datasets/hopesb/student-depression-dataset)

## Equipo

- Diana Lorena Giraldo Arboleda — 
- Elvis Raúl Hernández Cáceres — 
- Julián David Florido González — 
- Juan Pablo Obando Álvarez — 

Universidad de los Andes — 2026
