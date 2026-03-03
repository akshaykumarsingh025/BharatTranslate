from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import asr, ocr, translate, transliterate, tts, phrasebook, document

app = FastAPI(title="BharatTranslate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate.router, prefix="/v1", tags=["Translate"])
app.include_router(transliterate.router, prefix="/v1", tags=["Transliterate"])
app.include_router(asr.router, prefix="/v1", tags=["ASR"])
app.include_router(tts.router, prefix="/v1", tags=["TTS"])
app.include_router(ocr.router, prefix="/v1", tags=["OCR"])
app.include_router(phrasebook.router, prefix="/v1/phrasebook", tags=["Phrasebook"])
app.include_router(document.router, prefix="/v1/document", tags=["Document"])

@app.get("/")
def read_root():
    return {"message": "Welcome to BharatTranslate API"}
