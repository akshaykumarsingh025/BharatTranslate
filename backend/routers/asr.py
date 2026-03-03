"""
ASR Router — Speech to Text
"""
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from services.asr_service import asr_service

router = APIRouter()

@router.post("/asr/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form(...)
):
    """Convert spoken audio file to text."""
    audio_bytes = await file.read()
    result = await asr_service.transcribe(audio_bytes, language)
    return {
        "text": result,
        "language": language,
        "engine": "AI Kosh ASR"
    }
