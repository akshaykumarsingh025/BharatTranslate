"""
Transliteration Router — Roman ↔ Native script conversion
"""
from fastapi import APIRouter
from pydantic import BaseModel

from services.transliteration import transliteration_engine

router = APIRouter()


class TransliterateRequest(BaseModel):
    text: str
    language: str
    mode: str = "roman_to_native"  # "roman_to_native" or "native_to_roman"


class TransliterateResponse(BaseModel):
    result: str
    language: str
    mode: str
    engine: str = "IndicTrans2 (AI Kosh)"


@router.post("/transliterate", response_model=TransliterateResponse)
async def transliterate(req: TransliterateRequest):
    """Convert between Roman and Native scripts."""
    result = await transliteration_engine.transliterate(req.text, req.language, req.mode)
    return TransliterateResponse(
        result=result,
        language=req.language,
        mode=req.mode,
    )
