"""
Translation Router — handles all translation endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel

from services.translation_engine import translation_engine

router = APIRouter()


class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str


class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str
    engine: str = "IndicTrans2 (AI Kosh)"


@router.post("/translate/text", response_model=TranslateResponse)
async def translate_text(req: TranslateRequest):
    """Translate text between any two supported Indian languages."""
    result = await translation_engine.translate(req.text, req.source_lang, req.target_lang)
    return TranslateResponse(
        translated_text=result,
        source_lang=req.source_lang,
        target_lang=req.target_lang,
    )


@router.get("/translate/languages")
async def get_languages():
    """List all 22 supported languages (IndicTrans2 full coverage)."""
    return {
        "languages": [
            # Original 10
            {"code": "en",  "name": "English",            "native": "English",        "script": "Latin"},
            {"code": "hi",  "name": "Hindi",              "native": "हिन्दी",           "script": "Devanagari"},
            {"code": "bn",  "name": "Bengali",            "native": "বাংলা",           "script": "Bengali"},
            {"code": "ta",  "name": "Tamil",              "native": "தமிழ்",           "script": "Tamil"},
            {"code": "te",  "name": "Telugu",             "native": "తెలుగు",          "script": "Telugu"},
            {"code": "mr",  "name": "Marathi",            "native": "मराठी",           "script": "Devanagari"},
            {"code": "gu",  "name": "Gujarati",           "native": "ગુજરાતી",         "script": "Gujarati"},
            {"code": "kn",  "name": "Kannada",            "native": "ಕನ್ನಡ",           "script": "Kannada"},
            {"code": "ml",  "name": "Malayalam",          "native": "മലയാളം",          "script": "Malayalam"},
            {"code": "pa",  "name": "Punjabi",            "native": "ਪੰਜਾਬੀ",          "script": "Gurmukhi"},
            # Additional 12
            {"code": "or",  "name": "Odia",               "native": "ଓଡ଼ିଆ",           "script": "Odia"},
            {"code": "as",  "name": "Assamese",           "native": "অসমীয়া",         "script": "Bengali"},
            {"code": "ur",  "name": "Urdu",               "native": "اردو",            "script": "Arabic"},
            {"code": "sa",  "name": "Sanskrit",           "native": "संस्कृतम्",        "script": "Devanagari"},
            {"code": "mai", "name": "Maithili",           "native": "मैथिली",          "script": "Devanagari"},
            {"code": "sd",  "name": "Sindhi",             "native": "سنڌي",            "script": "Arabic"},
            {"code": "kok", "name": "Konkani",            "native": "कोंकणी",          "script": "Devanagari"},
            {"code": "doi", "name": "Dogri",              "native": "डोगरी",           "script": "Devanagari"},
            {"code": "mni", "name": "Manipuri (Meitei)",  "native": "মণিপুরী",         "script": "Bengali"},
            {"code": "sat", "name": "Santali",            "native": "ᱥᱟᱱᱛᱟᱲᱤ",        "script": "Ol Chiki"},
            {"code": "kas", "name": "Kashmiri",           "native": "کٲشُر",           "script": "Arabic"},
            {"code": "brx", "name": "Bodo",               "native": "बड़ो",            "script": "Devanagari"},
        ]
    }
