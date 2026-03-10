# Manual de Usuario — Sistema de Alerta Temprana de Riesgo Depresivo

## 1. Descripción General

El **Sistema de Alerta Temprana de Riesgo Depresivo** es una aplicación web diseñada para el departamento de Bienestar Estudiantil de una universidad. Permite estimar la probabilidad de depresión en estudiantes universitarios utilizando un modelo de Machine Learning (Regresión Logística B optimizada), basado en 15 variables académicas, demográficas y de estilo de vida.

**URL de acceso:** https://microproyecto-seg-columna-production.up.railway.app

---

## 2. Navegación Principal

La aplicación cuenta con un menú lateral izquierdo con las siguientes secciones:

| Sección | Icono | Descripción |
|---|---|---|
| **Inicio** | 🏠 | Simulador de riesgo individual |
| **Estudiantes** | 👥 | Lista completa de estudiantes con predicciones |
| **Análisis** | 📊 | Panel de analíticas agregadas |
| **Configuración** | ⚙️ | Ajustes del sistema |

---

## 3. Vista Inicio — Simulador de Riesgo

### 3.1 ¿Qué hace?
Permite al psicólogo u orientador ingresar el perfil de un estudiante y obtener una estimación de riesgo de depresión en tiempo real.

### 3.2 Campos del formulario

| Campo | Descripción | Valores posibles |
|---|---|---|
| **Género** | Género del estudiante | Femenino / Masculino |
| **Edad** | Edad en años | Slider (18-60) |
| **Programa Académico** | Carrera o programa | Desplegable (BSc, B.Pharm, etc.) |
| **Ciudad** | Ciudad de residencia | Desplegable |
| **Promedio de Notas (CGPA)** | Promedio acumulado | Slider (0-10) |
| **Duración del Sueño** | Horas de sueño promedio | 5-6 hours, 7-8 hours, Less than 5 hours, etc. |
| **Presión Académica** | Nivel de presión percibida | 1 (baja) a 5 (alta) |
| **Estrés Financiero** | Nivel de estrés económico | 1 (bajo) a 5 (alto) |
| **Hábitos Alimentarios** | Calidad de alimentación | Saludable, Moderado, Otros, No saludable |
| **Antecedentes Familiares** | Historia familiar de enfermedad mental | Sí / No |
| **Horas de Trabajo/Estudio** | Horas diarias dedicadas | Slider (0-12) |
| **Satisfacción Académica** | Nivel de satisfacción con estudios | 1 a 5 |
| **Satisfacción Laboral** | Nivel de satisfacción laboral | 1 a 5 |

### 3.3 Cómo usar el simulador

1. Complete todos los campos del formulario con los datos del estudiante.
2. Haga clic en el botón **"Analizar Riesgo"**.
3. El panel derecho mostrará:
   - **Medidor de riesgo** (gauge chart): Indica visualmente el porcentaje de probabilidad con colores (verde = bajo, amarillo = moderado, rojo = alto).
   - **Etiqueta de riesgo**: RIESGO BAJO, RIESGO MODERADO o RIESGO ALTO.
   - **Probabilidad numérica**: Porcentaje exacto estimado por el modelo.
   - **Factores contribuyentes**: Lista de los factores que más influyen en el riesgo del estudiante evaluado.

### 3.4 Interpretación de niveles de riesgo

| Nivel | Probabilidad | Color | Acción sugerida |
|---|---|---|---|
| **RIESGO BAJO** | < 40% | 🟢 Verde | Seguimiento estándar |
| **RIESGO MODERADO** | 40% – 69% | 🟡 Amarillo | Monitoreo activo, citar a orientación |
| **RIESGO ALTO** | ≥ 70% | 🔴 Rojo | Intervención prioritaria, derivar a psicología |

---

## 4. Vista Estudiantes — Lista con Predicciones

### 4.1 ¿Qué hace?
Muestra una tabla con todos los estudiantes del dataset (27,901 registros), cada uno con su predicción de riesgo precalculada por el modelo.

### 4.2 Funcionalidades

- **Búsqueda por ID**: Escriba el número de identificación del estudiante en la barra de búsqueda superior.
- **Filtro por nivel de riesgo**: Seleccione "Alto Riesgo", "Riesgo Moderado", "Bajo Riesgo" o "Todos" en el menú desplegable.
- **Paginación**: Navegue entre páginas usando los controles inferiores.
- **Tarjetas de resumen**: En la parte superior se muestran los conteos totales por nivel de riesgo.

### 4.3 Columnas de la tabla

| Columna | Descripción |
|---|---|
| ID | Identificador del estudiante |
| Género | Male / Female |
| Edad | Edad en años |
| Programa | Carrera académica |
| Probabilidad | Porcentaje de riesgo estimado |
| Nivel de Riesgo | Etiqueta de color (Alto/Moderado/Bajo) |

### 4.4 Exportar datos a CSV

1. Haga clic en el botón **"Exportar CSV"** ubicado en la esquina superior derecha.
2. Se descargará un archivo `.csv` con los datos de la vista actual (respetando los filtros aplicados).
3. El archivo puede abrirse en Excel, Google Sheets u otra herramienta de análisis.

---

## 5. Vista Análisis — Panel de Analíticas

### 5.1 ¿Qué hace?
Presenta estadísticas agregadas y visualizaciones de datos para comprender los patrones de riesgo en toda la población estudiantil.

### 5.2 Indicadores principales (tarjetas superiores)

| Indicador | Descripción |
|---|---|
| **Total Estudiantes** | Cantidad total de registros en el dataset |
| **Prob. Promedio de Riesgo** | Promedio general de probabilidad de depresión |
| **Alto Riesgo** | Cantidad y porcentaje de estudiantes con probabilidad ≥ 70% |
| **Riesgo Moderado** | Cantidad y porcentaje con probabilidad entre 40% y 69% |

### 5.3 Gráficos disponibles

- **Distribución de Riesgo por Programa**: Gráfico de barras apiladas que muestra la composición de riesgo (alto/medio/bajo) por cada carrera académica.
- **Factores de Riesgo (conteo)**: Gráfico circular (pie chart) con los principales factores contribuyentes detectados en la población.
- **Estudiantes con Mayor Riesgo**: Lista de los 10 estudiantes con mayor probabilidad de riesgo, indicando su programa y factor principal.

### 5.4 Exportar reporte

1. Haga clic en el botón **"Exportar Reporte CSV"** en la esquina superior derecha.
2. Se genera un archivo CSV con el resumen estadístico completo: distribución de riesgo, top 10 programas, y top 5 estudiantes críticos.

---

## 6. Modelo de Machine Learning

### 6.1 Modelo utilizado
**Regresión Logística B** — Modelo de clasificación binaria optimizado mediante GridSearchCV.

### 6.2 Métricas de desempeño

| Métrica | Valor |
|---|---|
| Accuracy | 0.797 |
| Precision | 0.813 |
| Recall | 0.848 |
| F1-Score | 0.831 |

### 6.3 ¿Por qué se excluyó la variable de ideación suicida?
La variable "¿Ha tenido pensamientos suicidas?" fue excluida del modelo porque:
1. Es un **criterio diagnóstico** de depresión (DSM-5), no un predictor temprano.
2. Su inclusión genera **fuga de información** (*target leakage*), haciendo que el modelo confirme en lugar de predecir.
3. El objetivo del sistema es **alerta temprana**: identificar riesgo antes de que se presenten síntomas graves.

---

## 7. Preguntas Frecuentes

**¿El sistema reemplaza la evaluación clínica?**
No. El sistema es una herramienta de apoyo para priorizar la atención. Toda evaluación debe ser confirmada por un profesional de salud mental.

**¿Qué hacer si un estudiante aparece en RIESGO ALTO?**
Derivar inmediatamente al área de psicología de Bienestar Estudiantil para una evaluación personalizada.

**¿Los datos son en tiempo real?**
El sistema utiliza un dataset histórico de 27,901 registros. Las predicciones individuales del simulador se calculan en tiempo real basándose en los datos ingresados.
