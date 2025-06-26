from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse
import random

app = FastAPI()

# Mapa de sistemas dañados a códigos
SYSTEM_CODES = {
    "navigation": "NAV-01",
    "communications": "COM-02",
    "life_support": "LIFE-03",
    "engines": "ENG-04",
    "deflector_shield": "SHLD-05"
}
# Estado para almacenar el último sistema dañado
app.state.damaged_system = None

@app.get("/status")
async def get_status():
    # Elegir un sistema dañado aleatoriamente en cada llamada
    app.state.damaged_system = random.choice(list(SYSTEM_CODES.keys()))
    # Sistema dañado (elegido al azar al iniciar el servidor)
    return {"damaged_system": app.state.damaged_system}

@app.get("/repair-bay", response_class=HTMLResponse)
async def get_repair_bay():
    # Usar el último sistema dañado, o un mensaje si no hay estado
    damaged_system = app.state.damaged_system or "navigation"  # Fallback por si no se llamó /status
    code = SYSTEM_CODES[damaged_system]
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Repair</title>
    </head>
    <body>
    <div class="anchor-point">{code}</div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/teapot")
async def teapot():
    return Response(status_code=418, content="I'm a teapot", media_type="text/plain")

#PARA EJECUTAR SCRIPT MODO LOCAL uvicorn main:app --host 0.0.0.0 --port 8000