"""
BharatTranslate Backend — FastAPI Server
Powered by AI Kosh / IndicTrans2 models from AI4Bharat
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import translate, transliterate, tts, asr, ocr

app = FastAPI(
    title="BharatTranslate API",
    description="Indic language translation powered by AI Kosh (IndicTrans2)",
    version="1.0.0",
)

# CORS — allow mobile app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(translate.router, prefix="/v1", tags=["Translation"])
app.include_router(transliterate.router, prefix="/v1", tags=["Transliteration"])
app.include_router(tts.router, prefix="/v1", tags=["Text-to-Speech"])
app.include_router(asr.router, prefix="/v1", tags=["Speech-to-Text"])
app.include_router(ocr.router, prefix="/v1", tags=["Image-to-Text"])


@app.get("/")
async def root():
    return {
        "service": "BharatTranslate API",
        "powered_by": "AI Kosh — IndicTrans2 (AI4Bharat)",
        "status": "running",
    }


@app.get("/v1/health")
async def health():
    from services.translation_engine import translation_engine
    return {
        "status": "ok",
        "model_loaded": translation_engine.is_loaded(),
    }
