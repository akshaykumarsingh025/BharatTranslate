from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from services.document_service import extract_text, chunk_text, translate_document

router = APIRouter()

@router.post("/translate")
async def translate_document_endpoint(
    file: UploadFile = File(...),
    source_lang: str = Form(...),
    target_lang: str = Form(...)
):
    """
    Accepts multipart file upload, extracts text, and translates.
    """
    try:
        contents = await file.read()
        
        # Extract text based on file type
        original_text = extract_text(contents, file.filename)
        if not original_text:
             raise HTTPException(status_code=400, detail="Could not extract text from file")
        
        # Chunk text and translate
        chunks = chunk_text(original_text)
        translated_chunks = await translate_document(chunks, source_lang, target_lang)
        
        # Assemble translated document text
        translated_text = " ".join(translated_chunks)
        
        return {
            "original_text": original_text,
            "translated_text": translated_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
