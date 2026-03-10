import joblib
import pandas as pd
from fastapi import FastAPI

modelo = joblib.load("modelo_depresion_logistico.pkl")
columnas = joblib.load("columnas_modelo.pkl")

app = FastAPI()

@app.get("/")
def home():
    return {"mensaje": "API de predicción de depresión activa"}

@app.post("/predict")
def predecir(datos: dict):
    df = pd.DataFrame([datos])
    df = df[columnas]
    pred = modelo.predict(df)[0]
    return {"prediccion": int(pred)}
