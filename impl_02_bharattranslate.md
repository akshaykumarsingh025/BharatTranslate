# 🌐 BharatTranslate — Indic Language Translator & Transliterator
## Complete Implementation Plan

---

## 📋 Overview
**BharatTranslate** is a powerful multilingual translator and transliterator for Indian languages. Unlike Google Translate (weak in Indic-to-Indic), this app specializes in translating between Indian languages with voice input/output, Roman↔Native script conversion, and offline support — all powered by AI Kosh models.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                MOBILE APP (React Native)              │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │ Text     │  │ Voice      │  │ Camera          │  │
│  │ Translate│  │ Translate  │  │ Translate (OCR) │  │
│  └────┬─────┘  └─────┬──────┘  └────────┬────────┘  │
│       └───────────────┴─────────────────┬┘           │
└──────────────────────────────────────────┼────────────┘
                                           │
┌──────────────────────────────────────────┼────────────┐
│           BACKEND (Python FastAPI)        │            │
│  ┌──────────────┐  ┌────────────────┐   │            │
│  │ Translation  │  │ Transliteration│   │            │
│  │ Engine       │  │ Engine         │   │            │
│  │ (AI Kosh     │  │ (RomanSetu     │   │            │
│  │  NMT models) │  │  from AI Kosh) │   │            │
│  └──────────────┘  └────────────────┘   │            │
│  ┌──────────────┐  ┌────────────────┐   │            │
│  │ TTS Engine   │  │ ASR Engine     │   │            │
│  │ (A2TTS)      │  │ (Speech→Text)  │   │            │
│  └──────────────┘  └────────────────┘   │            │
│  ┌──────────────┐                        │            │
│  │ OCR Engine   │                        │            │
│  │ (AI Kosh OCR)│                        │            │
│  └──────────────┘                        │            │
└──────────────────────────────────────────────────────┘
```

---

## 🔗 AI Kosh Resources — Exact URLs

### Models
| Resource | URL | Purpose |
|----------|-----|---------|
| AI4Bharat RomanSetu 400M (Native→Roman) | https://aikosh.indiaai.gov.in/home/models/all (search "RomanSetu") | Transliteration |
| AI4Bharat RomanSetu 400M (Roman→Native) | https://aikosh.indiaai.gov.in/home/models/all | Transliteration |
| AI4Bharat RomanSetu 500M (Native→Roman) | https://aikosh.indiaai.gov.in/home/models/all | Transliteration |
| AI4Bharat RomanSetu 500M (Roman→Native) | https://aikosh.indiaai.gov.in/home/models/all | Transliteration |
| A2TTS Models (all 8 languages) | https://aikosh.indiaai.gov.in/home/models/all (search "A2TTS") | Voice output |
| Multilingual Translation Models | https://aikosh.indiaai.gov.in/home/models/1600 (Sector Agnostic) | Translation |
| NER Models | https://aikosh.indiaai.gov.in/home/models/all (search "NER") | Named entities |

### Toolkits & Use Cases
| Resource | URL |
|----------|-----|
| OCR Toolkit | https://aikosh.indiaai.gov.in/home/toolkit/t-ocr |
| AI Guardrails | https://aikosh.indiaai.gov.in/home/toolkit/ai_guardrails |
| Multilingual Translation Use Case | https://aikosh.indiaai.gov.in/home/use-cases/details/multilingual_indic_language_translation.html |

---

## 💻 Tech Stack

| Component | Technology | Cost |
|-----------|-----------|------|
| Mobile App | React Native (Expo) | Free |
| Backend | Python FastAPI | Free |
| Translation Models | AI Kosh NMT + RomanSetu | Free |
| TTS | A2TTS from AI Kosh | Free |
| OCR | AI Kosh OCR Toolkit | Free |
| Local Storage | SQLite (translation history) | Free |
| Cloud DB | Firebase Firestore | Free tier |
| Hosting | Render.com / Railway.app | Free tier |
| Play Store | Google Play Console | ₹2,100 one-time |

---

## 🗃️ Database Schema

### Table: `users`
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT,
    name TEXT,
    preferred_source_lang TEXT DEFAULT 'en',
    preferred_target_lang TEXT DEFAULT 'hi',
    is_premium BOOLEAN DEFAULT FALSE,
    translations_today INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `translations`
```sql
CREATE TABLE translations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_lang TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    translation_type TEXT,  -- text, voice, camera
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `phrasebooks`
```sql
CREATE TABLE phrasebooks (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    name TEXT NOT NULL,
    category TEXT,  -- travel, medical, business, daily
    phrases TEXT,   -- JSON array of {source, target, source_lang, target_lang}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Supported Languages
```json
{
  "languages": [
    {"code": "en", "name": "English", "native": "English", "script": "Latin"},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी", "script": "Devanagari"},
    {"code": "bn", "name": "Bengali", "native": "বাংলা", "script": "Bengali"},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்", "script": "Tamil"},
    {"code": "te", "name": "Telugu", "native": "తెలుగు", "script": "Telugu"},
    {"code": "mr", "name": "Marathi", "native": "मराठी", "script": "Devanagari"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "script": "Gujarati"},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "script": "Kannada"},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "script": "Malayalam"},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ", "script": "Gurmukhi"}
  ]
}
```

---

## 📱 App Screens & Flow

### Screen 1: Home / Text Translation
```
┌─────────────────────────┐
│ 🌐 BharatTranslate  ⚙️  │
│─────────────────────────│
│  [English    ▼] ⇄ [Hindi ▼] │
│─────────────────────────│
│  ┌───────────────────┐  │
│  │ Type or paste text │  │
│  │ here...           │  │
│  │                   │  │
│  └───────────────────┘  │
│        [Translate]       │
│  ┌───────────────────┐  │
│  │ अनुवादित पाठ      │  │
│  │ यहां दिखेगा       │  │
│  │ 🔊 📋 ⭐          │  │
│  └───────────────────┘  │
│─────────────────────────│
│  Recent Translations:    │
│  • Hello → नमस्ते       │
│  • Thank you → धन्यवाद  │
│─────────────────────────│
│  📝  🎤  📷  🔤  👤     │
│  Text Voice Cam Trans Prof│
└─────────────────────────┘
```

### Screen 2: Voice Translation
```
┌─────────────────────────┐
│  ← Voice Translate       │
│─────────────────────────│
│  [Tamil ▼] → [Hindi ▼]  │
│                          │
│  ┌───────────────────┐  │
│  │ நான் சாப்பிட       │  │
│  │ விரும்புகிறேன்      │  │
│  │       🔊            │  │
│  └───────────────────┘  │
│          ↓               │
│  ┌───────────────────┐  │
│  │ मुझे खाना पसंद है │  │
│  │       🔊            │  │
│  └───────────────────┘  │
│                          │
│  ┌───────────────────┐  │
│  │  🎤 Hold to Speak  │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Screen 3: Transliteration
```
┌─────────────────────────┐
│  ← Transliterate 🔤     │
│─────────────────────────│
│  Mode: Roman → Native   │
│  Language: [Hindi ▼]     │
│                          │
│  Type in Roman:          │
│  ┌───────────────────┐  │
│  │ namaste, aap kaise │  │
│  │ hain?              │  │
│  └───────────────────┘  │
│                          │
│  Output (Devanagari):    │
│  ┌───────────────────┐  │
│  │ नमस्ते, आप कैसे   │  │
│  │ हैं?               │  │
│  │ 📋 Copy            │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 🔌 API Endpoints

```
BASE_URL: https://api.bharattranslate.app/v1

Translation:
POST   /translate/text          # Translate text between languages
POST   /translate/voice         # Upload audio → translate → return audio
POST   /translate/image         # Upload image → OCR → translate
POST   /translate/batch         # Batch translate multiple texts

Transliteration:
POST   /transliterate           # Convert Roman↔Native script
POST   /transliterate/detect    # Auto-detect script

TTS:
POST   /tts/speak               # Text → Speech in chosen language

History:
GET    /history                  # User's translation history
POST   /history/favorite        # Mark as favorite
DELETE /history/{id}             # Delete from history

Phrasebook:
GET    /phrasebook               # List phrasebooks
POST   /phrasebook               # Create phrasebook
POST   /phrasebook/{id}/phrase   # Add phrase to phrasebook
```

---

## 📂 Project Folder Structure

```
bharattranslate/
├── mobile/
│   ├── App.js
│   ├── package.json
│   ├── src/
│   │   ├── screens/
│   │   │   ├── TextTranslateScreen.js
│   │   │   ├── VoiceTranslateScreen.js
│   │   │   ├── CameraTranslateScreen.js
│   │   │   ├── TransliterateScreen.js
│   │   │   ├── HistoryScreen.js
│   │   │   ├── PhrasebookScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── components/
│   │   │   ├── LanguagePicker.js
│   │   │   ├── TranslationCard.js
│   │   │   ├── AudioPlayer.js
│   │   │   └── SwapButton.js
│   │   ├── services/
│   │   │   ├── translateApi.js
│   │   │   ├── audioService.js
│   │   │   └── cameraService.js
│   │   └── i18n/
│   │       └── ... (language files)
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── translate.py
│   │   ├── transliterate.py
│   │   ├── tts.py
│   │   └── history.py
│   ├── services/
│   │   ├── translation_engine.py    # AI Kosh NMT models
│   │   ├── transliteration.py       # RomanSetu models
│   │   ├── tts_service.py           # A2TTS models
│   │   ├── ocr_service.py           # AI Kosh OCR
│   │   └── language_detector.py
│   ├── models/
│   │   ├── romansetu/               # Downloaded from AI Kosh
│   │   ├── nmt/                     # Neural Machine Translation
│   │   └── a2tts/                   # Text-to-Speech
│   └── database/
│       └── db.py
│
└── docs/
    └── README.md
```

---

## 💰 Monetization Strategy

| Revenue Stream | Details | Target |
|----------------|---------|--------|
| **Freemium** | Free: 50 translations/day. Premium: Unlimited | ₹79/month |
| **Offline Packs** | Download language models for offline use | ₹149 per language pack |
| **API Access** | Provide translation API to businesses | ₹2,000/month |
| **Google AdMob** | Non-intrusive banner ads for free users | ₹5-15 per 1000 views |
| **Business Plan** | Bulk translation for enterprises | ₹5,000/month |

---

## 🚀 Play Store Launch Plan

1. **App Name**: BharatTranslate - Indian Language Translator | भारत ट्रांसलेट
2. **Category**: Tools / Productivity
3. **Tags**: translator, hindi translator, tamil translator, Indian language, transliteration, bharat translate
4. **USP**: "Made for India. Works Indic-to-Indic, not just English."
5. **ASO Keywords**: "hindi translator app", "translate tamil to hindi", "Indian language translator", "transliteration app"
