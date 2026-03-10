# Manual de Instalación y Despliegue

## 1. Requisitos del Sistema

### Desarrollo local
| Componente | Versión mínima |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | 2.30+ |

### Despliegue en la nube (Railway)
- Cuenta en [Railway](https://railway.app) (plan gratuito: $5 USD/mes de crédito)
- Cuenta en [GitHub](https://github.com) con acceso al repositorio

---

## 2. Instalación Local (Desarrollo)

### 2.1 Clonar el repositorio

```bash
git clone https://github.com/Juanpabloobando/microproyecto-seg-columna.git
cd microproyecto-seg-columna
```

### 2.2 Backend (API FastAPI)

```bash
cd src/backend
pip install -r requirements.txt
```

**Dependencias principales:**
- `fastapi==0.115.0` — Framework web
- `uvicorn==0.30.6` — Servidor ASGI
- `scikit-learn==1.5.2` — Machine Learning
- `pandas==2.2.3` — Manipulación de datos
- `joblib==1.4.2` — Serialización del modelo

### 2.3 Entrenar el modelo

```bash
python train_model.py
```

Este script:
1. Lee el dataset desde `data/student_depression.csv` (27,901 registros)
2. Excluye la variable de ideación suicida (Modelo B)
3. Aplica StandardScaler a variables numéricas y OneHotEncoder a categóricas
4. Entrena Logistic Regression con hiperparámetros optimizados (C=0.01, penalty=l2)
5. Guarda el pipeline en `src/backend/models/logistic_b.joblib`

**Salida esperada:**
```
Accuracy: 0.7972
F1-Score: 0.8308
Modelo guardado en: src/backend/models/logistic_b.joblib
```

### 2.4 Iniciar el servidor backend

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Verificar que funciona:
```bash
curl http://127.0.0.1:8000/api/health
# Respuesta esperada: {"status":"ok","model_loaded":true}
```

### 2.5 Frontend (React + Vite)

En una nueva terminal:

```bash
cd src/frontend
npm install
npm run dev
```

El frontend se inicia en `http://localhost:5173` y se conecta automáticamente al backend mediante el proxy configurado en `vite.config.ts`.

### 2.6 Abrir la aplicación

Ir a **http://localhost:5173** en el navegador.

---

## 3. Estructura de Archivos Clave

```
microproyecto-seg-columna/
├── data/
│   └── student_depression.csv          # Dataset principal
├── src/
│   ├── backend/
│   │   ├── main.py                     # API FastAPI (5 endpoints + static serving)
│   │   ├── model_service.py            # Carga del modelo y predicciones
│   │   ├── train_model.py              # Entrenamiento del modelo
│   │   ├── requirements.txt            # Dependencias Python
│   │   └── models/
│   │       └── logistic_b.joblib       # Modelo serializado (8.2 KB)
│   └── frontend/
│       ├── src/
│       │   ├── api/client.ts           # Cliente HTTP para la API
│       │   └── views/
│       │       ├── Dashboard.tsx        # Simulador de riesgo
│       │       ├── Estudiantes.tsx      # Lista de estudiantes
│       │       └── Analisis.tsx         # Panel de analíticas
│       ├── package.json
│       └── vite.config.ts              # Proxy /api → backend
├── Dockerfile                          # Build multi-stage para Railway
├── railway.toml                        # Configuración de Railway
└── README.md
```

---

## 4. Despliegue en la Nube (Railway)

### 4.1 Requisitos previos
1. Tener el código actualizado y pusheado en GitHub.
2. Crear una cuenta gratuita en [https://railway.app](https://railway.app).

### 4.2 Paso a paso

#### Paso 1: Iniciar sesión en Railway
- Ir a [https://railway.app](https://railway.app)
- Clic en **"Login"** → **"Login with GitHub"**
- Autorizar la aplicación

#### Paso 2: Crear nuevo proyecto
- En el dashboard de Railway, clic en **"New Project"**
- Seleccionar **"Deploy from GitHub repo"**
- Buscar y seleccionar el repositorio `Juanpabloobando/microproyecto-seg-columna`
- Clic en **"Deploy Now"**

#### Paso 3: Configuración automática
Railway detectará automáticamente el `Dockerfile` y `railway.toml` del repositorio. El proceso de build:
1. Construye el frontend React (`npm run build`)
2. Instala las dependencias Python
3. Copia el modelo y dataset
4. Inicia el servidor FastAPI con uvicorn

#### Paso 4: Generar dominio público
- Una vez desplegado, ir a **Settings** del servicio
- En la sección **"Networking"**, clic en **"Generate Domain"**
- Railway asignará una URL como: `https://microproyecto-xxxx.up.railway.app`

#### Paso 5: Verificar el despliegue
- Abrir la URL generada en el navegador
- Verificar que el Dashboard carga correctamente
- Probar una predicción en el simulador
- Verificar el endpoint de salud: `https://[tu-url].up.railway.app/api/health`

### 4.3 Arquitectura del despliegue

```
┌──────────────────────────────────────────┐
│              Railway (un servicio)         │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │  FastAPI (uvicorn, puerto 8000)     │  │
│  │                                     │  │
│  │  /api/predict  ← POST predicción   │  │
│  │  /api/students ← GET estudiantes   │  │
│  │  /api/analytics ← GET analíticas   │  │
│  │  /api/health   ← GET health check  │  │
│  │                                     │  │
│  │  /* (cualquier otra ruta)           │  │
│  │   └─ Sirve React (index.html)      │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  ┌────────────────┐  ┌────────────────┐   │
│  │ logistic_b     │  │ student_       │   │
│  │ .joblib        │  │ depression.csv │   │
│  └────────────────┘  └────────────────┘   │
└──────────────────────────────────────────┘
```

### 4.4 Dockerfile explicado

El `Dockerfile` usa un build multi-stage:

- **Stage 1 (frontend-build):** Usa `node:18-alpine` para compilar el frontend React con `npm run build`, generando archivos estáticos en `dist/`.
- **Stage 2 (producción):** Usa `python:3.11-slim`, instala las dependencias Python, copia el backend, el dataset, y los archivos estáticos del frontend. Inicia uvicorn en el puerto 8000.

---

## 5. Variables de Entorno

El proyecto no requiere variables de entorno obligatorias para funcionar. Sin embargo, se pueden configurar opcionalmente en Railway:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | 8000 |

---

## 6. API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que la API y el modelo están activos |
| POST | `/api/predict` | Predicción individual (recibe JSON con 15 variables) |
| GET | `/api/students` | Lista paginada con filtros (`search`, `risk_filter`, `page`) |
| GET | `/api/analytics` | Estadísticas agregadas del dataset completo |
| GET | `/api/dataset/columns` | Valores únicos para los dropdowns del formulario |

### Ejemplo de predicción

```bash
curl -X POST https://[tu-url].up.railway.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Gender": "Male",
    "Age": 22,
    "City": "Bangalore",
    "Profession": "Student",
    "Academic Pressure": 4,
    "Work Pressure": 0,
    "CGPA": 3.5,
    "Study Satisfaction": 2,
    "Job Satisfaction": 0,
    "Sleep Duration": "5-6 hours",
    "Dietary Habits": "Moderate",
    "Degree": "BSc",
    "Work/Study Hours": 8,
    "Financial Stress": "4",
    "Family History of Mental Illness": "No"
  }'
```

**Respuesta esperada:**
```json
{
  "probability": 72.3,
  "prediction": 1,
  "risk_level": "high",
  "risk_label": "RIESGO ALTO",
  "contributing_factors": [
    "Promedio académico bajo (CGPA)",
    "Sueño reducido (5-6 horas)",
    "Alta presión académica",
    "Alto estrés financiero",
    "Excesivas horas de trabajo/estudio",
    "Baja satisfacción con los estudios"
  ]
}
```

---

## 7. Solución de Problemas

| Problema | Causa | Solución |
|---|---|---|
| `ModuleNotFoundError` | Dependencias no instaladas | Ejecutar `pip install -r requirements.txt` |
| `FileNotFoundError: dataset` | CSV no encontrado | Verificar que `data/student_depression.csv` existe |
| `FileNotFoundError: modelo` | Modelo no entrenado | Ejecutar `python train_model.py` |
| Frontend no conecta con backend | Proxy no configurado | Verificar `vite.config.ts` apunta a `http://127.0.0.1:8000` |
| Error 500 en `/api/predict` | Campos faltantes en el JSON | Verificar que se envían las 15 variables requeridas |
| Railway build falla | Dependencias incompatibles | Verificar versiones en `requirements.txt` y `package.json` |
