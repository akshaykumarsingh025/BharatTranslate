"""
OCR Router — Image to Text
"""
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from services.ocr_service import ocr_service

router = APIRouter()

@router.post("/ocr/extract")
async def extract_text_from_image(
    file: UploadFile = File(...),
    language: str = Form(...)
):
    """Extract text from an uploaded image."""
    image_bytes = await file.read()
    result = await ocr_service.extract_text(image_bytes, language)
    return {
        "text": result,
        "language": language,
        "engine": "AI Kosh OCR"
    }
