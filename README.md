# Sistema Predictivo de Riesgo Depresivo en Estudiantes Universitarios

Sistema de alerta temprana que utiliza Machine Learning para estimar el riesgo de depresión en estudiantes universitarios, basado en variables académicas, demográficas y de estilo de vida.

## Estructura del repositorio

```
├── data/
│   └── student_depression.csv              # Dataset (27,901 registros)
├── notebooks/
│   ├── Exploracion_de_datos_del_microproyecto.ipynb  # EDA
│   ├── Modelo final.ipynb                  # Entrenamiento + MLflow (6 modelos)
│   └── Modelos_Hiperparametros.ipynb       # GridSearchCV — optimización de hiperparámetros
├── reports/
│   ├── manual_usuario.md                   # Manual de usuario
│   └── manual_instalacion.md               # Manual de instalación y despliegue
├── src/
│   ├── backend/                            # API FastAPI + modelo ML
│   │   ├── main.py                         # Endpoints REST + servidor de archivos estáticos
│   │   ├── model_service.py                # Carga y predicción del modelo
│   │   ├── train_model.py                  # Script de entrenamiento (Logistic B, C=0.01)
│   │   ├── requirements.txt
│   │   └── models/logistic_b.joblib        # Modelo serializado
│   └── frontend/                           # React + Vite + TailwindCSS + shadcn/ui
│       ├── src/views/                      # Dashboard, Estudiantes, Análisis
│       ├── src/api/client.ts               # Cliente API
│       └── package.json
├── Dockerfile                              # Despliegue en Railway
├── railway.toml                            # Configuración Railway
└── README.md
```

## Aplicación desplegada

**URL de producción:** https://microproyecto-seg-columna-production.up.railway.app

## Requisitos (desarrollo local)

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

El script `train_model.py` lee el CSV desde `data/`, entrena el modelo Logistic Regression B (C=0.01) y lo guarda en `src/backend/models/logistic_b.joblib`. La API queda disponible en **http://127.0.0.1:8000**.

### 3. Frontend — Instalar dependencias e iniciar

```bash
cd src/frontend
npm install
npm run dev
```

El frontend queda disponible en **http://localhost:5173** y se conecta automáticamente al backend mediante un proxy configurado en Vite.

### 4. Abrir en el navegador

Ir a **http://localhost:5173**

## Modelo seleccionado: Logistic Regression B (optimizado)

Se evaluaron 6 configuraciones (3 algoritmos × 2 datasets). Los modelos "A" incluyen la variable de ideación suicida; los "B" la excluyen. Se seleccionó el **Modelo B** porque la ideación suicida es un criterio diagnóstico de depresión (no un predictor temprano), y su inclusión genera fuga de información (*target leakage*).

### Métricas de los 6 modelos base

| Modelo | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Logistic_A | 0.843 | 0.858 | 0.877 | 0.867 |
| XGB_A | 0.841 | 0.856 | 0.877 | 0.866 |
| RF_A | 0.838 | 0.847 | 0.883 | 0.865 |
| XGB_B | 0.798 | 0.814 | 0.849 | 0.831 |
| **Logistic_B** ✅ | **0.796** | **0.813** | **0.848** | **0.830** |
| RF_B | 0.792 | 0.805 | 0.851 | 0.828 |

### Optimización de hiperparámetros (GridSearchCV)

Se aplicó GridSearchCV con validación cruzada de 5 folds sobre los modelos B:

| Modelo | Hiperparámetros óptimos | F1 (CV) |
|---|---|---|
| **Logistic B** ✅ | C=0.01, penalty=l2, solver=lbfgs | **0.833** |
| Random Forest B | n_estimators=300, max_depth=15 | 0.833 |
| XGBoost B | learning_rate=0.1, max_depth=3 | 0.834 |

Los tres modelos obtuvieron F1 prácticamente idéntico. Se seleccionó **Logistic Regression B** por su simplicidad, interpretabilidad y menor riesgo de sobreajuste.

### Variables del modelo (15)

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
| Financial Stress | Categórica (1-5) |
| Family History of Mental Illness | Categórica (Yes/No) |

## Experimentos MLflow

Los 6 modelos fueron registrados en MLflow con el experimento `Proyecto_Depresion`. El notebook `notebooks/Modelo final.ipynb` contiene el código completo de entrenamiento y registro.

Servidor MLflow: `http://3.91.192.29:8050`

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

- Diana Lorena Giraldo Arboleda
- Elvis Raúl Hernández Cáceres
- Julián David Florido González
- Juan Pablo Obando Álvarez

Universidad de los Andes — 2026
