"""
Transliteration Engine — uses IndicTrans2 for script conversion
RomanSetu models from AI Kosh (AI4Bharat)
"""
from services.translation_engine import translation_engine


class TransliterationEngine:
    async def transliterate(self, text: str, lang_code: str, mode: str) -> str:
        """
        Transliterate between Roman and Native scripts.
        For now, uses translation as a proxy (en↔target).
        When RomanSetu models are downloaded, this will use those directly.
        """
        if not text or not text.strip():
            return ""

        if mode == "roman_to_native":
            # Roman → Native: translate from English to target language
            return await translation_engine.translate(text, "en", lang_code)
        else:
            # Native → Roman: translate from target language to English
            return await translation_engine.translate(text, lang_code, "en")


# Singleton
transliteration_engine = TransliterationEngine()
