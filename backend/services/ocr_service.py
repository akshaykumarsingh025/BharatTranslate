"""
OCR Service — Image-to-Text using EasyOCR
Supports English + Hindi + Bengali + Tamil + Telugu + Kannada + Marathi + Gujarati
"""
import os
import tempfile
import easyocr

# EasyOCR language codes
LANG_MAP = {
    "en": "en",
    "hi": "hi",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "mr": "mr",
    "kn": "kn",
    "ml": "ml",  # Note: EasyOCR may not support all Indic scripts
    "gu": "gu",
    "pa": "pa",
}


class OCRService:
    def __init__(self):
        self.readers = {}  # Cache readers per language

    def _get_reader(self, lang_code: str):
        """Get or create an EasyOCR reader for the given language."""
        ocr_lang = LANG_MAP.get(lang_code, "en")

        # Always include English alongside the Indic language
        lang_list = [ocr_lang]
        if ocr_lang != "en":
            lang_list.append("en")

        cache_key = "_".join(sorted(lang_list))

        if cache_key not in self.readers:
            print(f"[OCR] Loading EasyOCR for languages: {lang_list} (first time downloads models)...")
            try:
                self.readers[cache_key] = easyocr.Reader(lang_list, gpu=False)
                print(f"[OCR] EasyOCR loaded successfully for {lang_list}!")
            except Exception as e:
                print(f"[OCR] Warning: Failed to load {lang_list}, falling back to English only: {e}")
                self.readers[cache_key] = easyocr.Reader(["en"], gpu=False)

        return self.readers[cache_key]

    async def extract_text(self, image_bytes: bytes, lang_code: str) -> str:
        """
        Extract text from image bytes using EasyOCR.
        """
        # Write image to a temp file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        try:
            reader = self._get_reader(lang_code)
            results = reader.readtext(tmp_path)

            # Combine all detected text blocks
            extracted_lines = [text for (_, text, confidence) in results if confidence > 0.3]
            full_text = " ".join(extracted_lines).strip()

            print(f"[OCR] Extracted text: {full_text}")
            return full_text if full_text else ""
        except Exception as e:
            print(f"[OCR] Error during extraction: {e}")
            return ""
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)


ocr_service = OCRService()
