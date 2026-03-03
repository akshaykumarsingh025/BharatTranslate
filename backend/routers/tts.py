"""
TTS Router — Text to Speech
"""
from fastapi import APIRouter
from pydantic import BaseModel

from services.tts_service import tts_service

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    language: str


@router.post("/tts/speak")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech audio."""
    result = await tts_service.speak(req.text, req.language)
    return result
