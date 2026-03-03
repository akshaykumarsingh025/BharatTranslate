"""
ASR Service — Speech-to-Text using Faster-Whisper
Supports Indian languages via the Whisper 'base' model (~150MB download on first use)
"""
import os
import tempfile
from faster_whisper import WhisperModel

# Language code mapping for Whisper
LANG_MAP = {
    "en": "en",
    "hi": "hi",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "mr": "mr",
    "gu": "gu",
    "kn": "kn",
    "ml": "ml",
    "pa": "pa",
}


class ASRService:
    def __init__(self):
        self.model = None

    def _load_model(self):
        if self.model is None:
            print("[ASR] Loading Whisper 'base' model (first time takes ~1 min to download)...")
            self.model = WhisperModel("base", device="cpu", compute_type="int8")
            print("[ASR] Model loaded successfully!")

    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> str:
        """
        Transcribe audio bytes to text using Faster-Whisper.
        """
        self._load_model()

        # Write audio to a temp file (Whisper needs a file path)
        with tempfile.NamedTemporaryFile(suffix=".m4a", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            whisper_lang = LANG_MAP.get(lang_code, "en")
            segments, info = self.model.transcribe(
                tmp_path,
                language=whisper_lang,
                beam_size=5,
            )

            # Collect all segment texts
            full_text = ""
            for segment in segments:
                full_text += segment.text

            full_text = full_text.strip()
            print(f"[ASR] Transcribed ({info.language}): {full_text}")
            return full_text if full_text else ""
        except Exception as e:
            print(f"[ASR] Error during transcription: {e}")
            return ""
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)


asr_service = ASRService()
