import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, Moon, TrendingUp, DollarSign, BookOpen, Utensils, Users, Loader2 } from 'lucide-react';
import GaugeChart from '@/components/GaugeChart';
import { predictRisk, getDatasetColumns } from '@/api/client';
import type { PredictionResult, DatasetColumns } from '@/api/client';

export default function Dashboard() {
  // ── Estado del formulario ──
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState([22]);
  const [city, setCity] = useState('Bangalore');
  const [profession, setProfession] = useState('Student');
  const [academicPressure, setAcademicPressure] = useState(3);
  const [workPressure, setWorkPressure] = useState(0);
  const [cgpa, setCgpa] = useState([5.0]);
  const [studySatisfaction, setStudySatisfaction] = useState(3);
  const [jobSatisfaction, setJobSatisfaction] = useState(0);
  const [sleepDuration, setSleepDuration] = useState('7-8 hours');
  const [dietaryHabits, setDietaryHabits] = useState('Moderate');
  const [degree, setDegree] = useState('BSc');
  const [workStudyHours, setWorkStudyHours] = useState([5]);
  const [financialStress, setFinancialStress] = useState(2);
  const [familyHistory, setFamilyHistory] = useState('No');
  const [suicidalThoughts, setSuicidalThoughts] = useState('No');

  // ── Estado de resultados ──
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  // ── Opciones del dataset ──
  const [columns, setColumns] = useState<DatasetColumns | null>(null);

  useEffect(() => {
    getDatasetColumns()
      .then(setColumns)
      .catch(() => {});
  }, []);

  const sleepOptions = columns?.sleep_durations ?? [
    'Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours',
  ];
  const pressureLevels = [1, 2, 3, 4, 5];
  const dietOptions = columns?.dietary_habits ?? ['Healthy', 'Moderate', 'Unhealthy'];

  const calculateRisk = async () => {
    setLoading(true);
    setError('');
    try {
      const prediction = await predictRisk({
        Gender: gender,
        Age: age[0],
        City: city,
        Profession: profession,
        "Academic Pressure": academicPressure,
        "Work Pressure": workPressure,
        CGPA: cgpa[0],
        "Study Satisfaction": studySatisfaction,
        "Job Satisfaction": jobSatisfaction,
        "Sleep Duration": sleepDuration,
        "Dietary Habits": dietaryHabits,
        Degree: degree,
        "Work/Study Hours": workStudyHours[0],
        "Financial Stress": String(financialStress),
        "Family History of Mental Illness": familyHistory,
        "Have you ever had suicidal thoughts ?": suicidalThoughts,
      });
      setResult(prediction);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (level: string) => {
    if (level === 'high') return { label: 'RIESGO ALTO', color: 'bg-red-500' };
    if (level === 'medium') return { label: 'RIESGO MODERADO', color: 'bg-yellow-500' };
    return { label: 'RIESGO BAJO', color: 'bg-green-500' };
  };

  const riskLevel = result ? getRiskLevel(result.risk_level) : { label: '', color: '' };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Student Profile */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <CardTitle className="text-xl text-gray-800">Perfil del Estudiante</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Row: Gender + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Género</Label>
                <div className="flex gap-2">
                  {(columns?.genders ?? ['Male', 'Female']).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        gender === g
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g === 'Male' ? 'Masculino' : 'Femenino'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-medium">Edad</Label>
                  <span className="text-blue-600 font-bold">{age[0]}</span>
                </div>
                <Slider value={age} onValueChange={setAge} max={40} min={17} step={1} className="w-full" />
              </div>
            </div>

            {/* Row: Degree + City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Programa Académico
                </Label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {(columns?.degrees ?? ['BSc', 'BA', 'B.Pharm', 'BCA', 'B.Tech', 'B.Com', 'B.Ed', 'BBA', 'LLB', 'B.Arch', 'MBBS', 'MCA', 'MSc', 'M.Tech', 'MBA', 'MD', 'PhD']).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Ciudad</Label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Bangalore"
                  className="w-full"
                />
              </div>
            </div>

            {/* CGPA Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-medium">Promedio de Notas (CGPA)</Label>
                <span className="text-blue-600 font-bold text-lg">{cgpa[0].toFixed(1)}</span>
              </div>
              <Slider value={cgpa} onValueChange={setCgpa} max={10} min={0} step={0.1} className="w-full" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
              </div>
            </div>

            {/* Sleep Duration */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Duración del Sueño
              </Label>
              <div className="flex flex-wrap gap-2">
                {sleepOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSleepDuration(option)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      sleepDuration === option
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Pressure */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Presión Académica (1-5)
              </Label>
              <div className="flex gap-2">
                {pressureLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setAcademicPressure(level)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      academicPressure === level
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Stress */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Estrés Financiero (1-5)
              </Label>
              <div className="flex gap-2">
                {pressureLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFinancialStress(level)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      financialStress === level
                        ? level >= 4
                          ? 'bg-red-500 text-white shadow-md'
                          : level >= 3
                          ? 'bg-yellow-500 text-white shadow-md'
                          : 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Row: Dietary Habits + Family History */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Hábitos Alimentarios
                </Label>
                <div className="flex gap-1">
                  {dietOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDietaryHabits(d)}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                        dietaryHabits === d
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d === 'Healthy' ? 'Saludable' : d === 'Moderate' ? 'Moderado' : 'No saludable'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Antecedentes Familiares
                </Label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFamilyHistory(v)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        familyHistory === v
                          ? v === 'Yes'
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {v === 'Yes' ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Suicidal Thoughts */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ¿Ha tenido pensamientos suicidas?
              </Label>
              <div className="flex gap-2">
                {['Yes', 'No'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSuicidalThoughts(v)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      suicidalThoughts === v
                        ? v === 'Yes'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {v === 'Yes' ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Work/Study Hours */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-medium">Horas de Trabajo/Estudio</Label>
                <span className="text-blue-600 font-bold">{workStudyHours[0]}h</span>
              </div>
              <Slider value={workStudyHours} onValueChange={setWorkStudyHours} max={12} min={0} step={1} className="w-full" />
            </div>

            {/* Row: Study Satisfaction + Job Satisfaction */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-xs">Satisfacción Académica (1-5)</Label>
                <div className="flex gap-1">
                  {pressureLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setStudySatisfaction(level)}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all ${
                        studySatisfaction === level
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-xs">Satisfacción Laboral (0-5)</Label>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setJobSatisfaction(level)}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all ${
                        jobSatisfaction === level
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={calculateRisk}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  Analizar Riesgo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Card - Risk Prediction */}
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <CardTitle className="text-xl text-gray-800">Predicción de Riesgo</CardTitle>
              <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">
                Modelo: Logistic Regression A
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!showResults || !result ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Ingrese los datos y presione "Analizar Riesgo"</p>
                <p className="text-sm">La predicción será generada por el modelo de ML</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Gauge Chart */}
                <div className="flex flex-col items-center">
                  <GaugeChart percentage={Math.round(result.probability)} />
                  <Badge
                    className={`mt-4 ${riskLevel.color} text-white text-lg px-6 py-2 font-bold`}
                  >
                    {riskLevel.label}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-2">
                    Probabilidad: {result.probability}%
                  </p>
                </div>

                {/* Contributing Factors */}
                {result.contributing_factors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Factores Contribuyentes
                    </h4>
                    <ul className="space-y-2">
                      {result.contributing_factors.map((factor, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                        >
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Resumen del Estudiante</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Género:</span>
                      <span className="ml-2 font-medium">{gender === 'Male' ? 'Masculino' : 'Femenino'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Edad:</span>
                      <span className="ml-2 font-medium">{age[0]} años</span>
                    </div>
                    <div>
                      <span className="text-gray-500">CGPA:</span>
                      <span className="ml-2 font-medium">{cgpa[0].toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Programa:</span>
                      <span className="ml-2 font-medium">{degree}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sueño:</span>
                      <span className="ml-2 font-medium">{sleepDuration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Presión:</span>
                      <span className="ml-2 font-medium">{academicPressure}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estrés Fin.:</span>
                      <span className="ml-2 font-medium">{financialStress}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Antec. Fam.:</span>
                      <span className="ml-2 font-medium">{familyHistory === 'Yes' ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
