"""
TTS Service — Text to Speech
Uses expo-speech on the client side for now.
When A2TTS models from AI Kosh are downloaded, this will generate audio server-side.
"""


class TTSService:
    async def speak(self, text: str, lang_code: str) -> dict:
        """
        Returns text + language for the client to use expo-speech.
        When A2TTS models are available, this will return audio bytes.
        """
        return {
            "text": text,
            "language": lang_code,
            "audio_url": None,  # Will be populated when A2TTS is integrated
            "engine": "client_side",
        }


tts_service = TTSService()
