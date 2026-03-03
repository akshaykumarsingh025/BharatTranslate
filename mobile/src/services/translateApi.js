/**
 * BharatTranslate API Service
 * Connects to the FastAPI backend powered by AI Kosh (IndicTrans2)
 *
 * All translation goes through our backend — no third-party APIs.
 */

// Change this to your deployed backend URL when deploying
const BASE_URL = 'http://192.168.1.33:8000/v1';

export const TranslateAPI = {

    /**
     * Translate text via the backend (IndicTrans2 model)
     */
    async translateText(text, sourceLang, targetLang) {
        if (!text || !text.trim()) return '';
        if (sourceLang === targetLang) return text;

        try {
            const response = await fetch(`${BASE_URL}/translate/text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.translated_text || text;
        } catch (error) {
            console.error('[TranslateAPI] Error:', error);
            return `⚠️ Cannot connect to backend server. Make sure the FastAPI server is running at ${BASE_URL}`;
        }
    },

    /**
     * Transliterate via the backend (RomanSetu / IndicTrans2)
     */
    async transliterate(text, languageCode, mode) {
        if (!text || !text.trim()) return '';

        const apiMode = mode === 'Roman → Native' ? 'roman_to_native' : 'native_to_roman';

        try {
            const response = await fetch(`${BASE_URL}/transliterate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    language: languageCode,
                    mode: apiMode,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.result || text;
        } catch (error) {
            console.error('[TranslateAPI] Transliterate error:', error);
            return `⚠️ Cannot connect to backend server.`;
        }
    },

    /**
     * Toggle favorite status (local-only for now)
     */
    async toggleFavorite(translationId, isFavorite) {
        return true;
    },

    /**
     * Speech-to-Text (ASR)
     */
    async transcribeAudio(audioUri, languageCode) {
        if (!audioUri) return '';
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: audioUri,
                type: 'audio/m4a',
                name: 'audio.m4a',
            });
            formData.append('language', languageCode);

            const response = await fetch(`${BASE_URL}/asr/transcribe`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            return data.text || '';
        } catch (error) {
            console.error('[TranslateAPI] Transcribe error:', error);
            return '';
        }
    },

    /**
     * Image-to-Text (OCR)
     */
    async extractTextFromImage(imageUri, languageCode) {
        if (!imageUri) return '';
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
            formData.append('language', languageCode);

            const response = await fetch(`${BASE_URL}/ocr/extract`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            return data.text || '';
        } catch (error) {
            console.error('[TranslateAPI] OCR error:', error);
            return '';
        }
    },

    /**
     * Check if the backend is reachable
     */
    async checkHealth() {
        try {
            const response = await fetch(`${BASE_URL}/health`);
            const data = await response.json();
            return data;
        } catch {
            return { status: 'unreachable', model_loaded: false };
        }
    },
};
