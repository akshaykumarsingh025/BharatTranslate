# BharatTranslate — Premium Features Implementation Plan

5 new features to make BharatTranslate a **Google Translate killer** for Indian languages.

---

## Feature 1: 🗣️ Conversation Mode (Real-Time Interpreter)

Two people speak different languages. The app alternates: records Person A → translates → speaks in Person B's language, then vice versa.

### Architecture
```
Person A speaks Tamil  →  [ASR]  →  Tamil text  →  [IndicTrans2]  →  Hindi text  →  [TTS]  →  Person B hears Hindi
Person B speaks Hindi  →  [ASR]  →  Hindi text  →  [IndicTrans2]  →  Tamil text  →  [TTS]  →  Person A hears Tamil
```

### Changes

#### [NEW] `mobile/src/screens/ConversationScreen.js`
- Split-screen UI: **top half** = Person A (blue), **bottom half** = Person B (green)
- Each half has a big mic button + language selector
- When one person speaks, a spinning "translating..." animation plays
- Translated result appears in the other person's section and auto-plays via TTS
- Conversation log scrolls in the center showing all exchanges
- Uses existing `expo-av` recording + backend `/v1/asr/transcribe` + `/v1/translate/text`

#### [MODIFY] `App.js`
- Add `Conversation` tab to bottom navigator with `chatbubbles` icon
- Navigation restructure: use a **drawer** or **more menu** since we'll have 8+ screens (too many for bottom tabs)

### Backend
No new endpoints needed — reuses existing ASR + Translation + TTS endpoints.

---

## Feature 2: 📖 Phrasebook

Pre-loaded phrases organized by category (Travel, Medical, Business, Daily, Emergency) in all 10 languages.

### Data Structure
```json
{
  "category": "Travel",
  "icon": "airplane",
  "phrases": [
    {
      "id": "travel_001",
      "en": "Where is the nearest hospital?",
      "hi": "निकटतम अस्पताल कहाँ है?",
      "bn": "নিকটতম হাসপাতাল কোথায়?",
      "ta": "அருகிலுள்ள மருத்துவமனை எங்கே?",
      ...all 10 languages
    }
  ]
}
```

### Changes

#### [NEW] `mobile/src/data/phrasebook.json`
- ~200 phrases across 5 categories × 10 languages = 2,000 pre-translated entries
- Categories: **Travel** (50), **Medical** (40), **Business** (40), **Daily** (40), **Emergency** (30)
- All translations pre-generated via IndicTrans2 backend during development

#### [NEW] `mobile/src/screens/PhrasebookScreen.js`
- Category cards grid (Travel 🛫, Medical 🏥, Business 💼, Daily 🏠, Emergency 🚨)
- Tap category → shows phrase list with source language on left, target language on right
- Each phrase has a 🔊 button to speak it aloud
- Search bar to find phrases quickly
- Language pair selector at top

#### [NEW] `backend/routers/phrasebook.py`
- `POST /v1/phrasebook/generate` — Batch-translate phrases using IndicTrans2 (used during development to build the JSON)

---

## Feature 3: 📴 Offline Mode

Download language packs to the device so translation works without internet.

### Architecture
```
Online:   Mobile → HTTP → Backend → IndicTrans2 → Response
Offline:  Mobile → Local SQLite Cache → Cached Translation (if available)
                 → Show "not cached" message (if unavailable)
```

### Changes

#### [NEW] `mobile/src/services/offlineCache.js`
- Uses `expo-sqlite` to store translation pairs locally
- Schema: `CREATE TABLE cache (id, source_text, source_lang, target_lang, translated_text, timestamp)`
- Every successful translation is auto-cached
- Cache lookup happens first before hitting the backend
- Cache size management: max 10,000 entries per language pair, LRU eviction

#### [NEW] `mobile/src/screens/OfflineSettingsScreen.js`
- Shows all downloaded language pairs with cache sizes
- "Download Pack" button pre-downloads the phrasebook for that language pair
- "Clear Cache" per language pair
- Toggle: "Prefer offline" (use cache first, skip network)
- Storage usage indicator

#### [MODIFY] `mobile/src/services/translateApi.js`
- Wrap `translateText()`: check offline cache first → if miss, call backend → cache result
- If network error + cache miss → return "Translation not available offline"

#### Dependencies
- `expo-sqlite` — local database for cached translations

---

## Feature 4: 📄 Document Translation

Upload a PDF, DOCX, or TXT file → extract text → translate → download translated document.

### Architecture
```
Mobile uploads PDF → Backend extracts text (PyPDF2) → Splits into chunks
→ Translates each chunk via IndicTrans2 → Assembles translated document
→ Returns translated PDF/text to mobile
```

### Changes

#### [NEW] `mobile/src/screens/DocumentTranslateScreen.js`
- File picker (using `expo-document-picker`) supporting PDF, DOCX, TXT
- Upload progress bar
- Shows original text vs translated text side-by-side
- "Download Translated" button to save to device
- Language pair selector

#### [NEW] `backend/routers/document.py`
- `POST /v1/document/translate` — Accepts multipart file upload + source_lang + target_lang
  - Extracts text from PDF (`PyPDF2`), DOCX (`python-docx`), or plain TXT
  - Splits into sentence-level chunks (max 512 tokens per chunk for IndicTrans2)
  - Translates each chunk
  - Returns JSON with original + translated text arrays
- `POST /v1/document/download` — Returns a generated translated text file

#### [NEW] `backend/services/document_service.py`
- `extract_text(file_bytes, file_type)` → raw text
- `chunk_text(text)` → list of sentence-level chunks
- `translate_document(chunks, src, tgt)` → translated chunks

#### Backend Dependencies
- `PyPDF2` — PDF text extraction
- `python-docx` — DOCX text extraction

---

## Feature 5: 🗺️ Regional Dialect Support

Support regional variants that Google Translate completely ignores.

### Dialect Map
| Language | Dialects to Support |
|----------|-------------------|
| Hindi | Khariboli (standard), Bhojpuri, Rajasthani, Chhattisgarhi, Maithili |
| Bengali | Standard Bangla, Sylheti |
| Tamil | Standard Tamil, Sri Lankan Tamil |
| Marathi | Standard, Varhadi |
| Punjabi | Majhi (standard), Doabi |

### Changes

#### [MODIFY] `mobile/src/components/LanguagePicker.js`
- Add a "Dialect" sub-selector that appears when a language is selected
- If the language has dialects, show a secondary dropdown
- Default to "Standard" dialect

#### [NEW] `mobile/src/data/dialectMap.json`
- Maps language codes to available dialect variants with display names

#### [MODIFY] `backend/services/translation_engine.py`
- Accept optional `dialect` parameter
- For supported dialects: apply post-processing rules (vocabulary substitution, script variations)
- Uses a dialect glossary JSON that maps standard words → dialect equivalents

#### [NEW] `backend/data/dialect_glossaries/`
- `bhojpuri.json`, `rajasthani.json`, etc.
- Each contains 500-1000 word/phrase mappings from standard → dialect
- Example: Hindi "क्या हाल है?" → Bhojpuri "का हाल बा?"

#### [MODIFY] `backend/routers/translate.py`
- Add optional `dialect` field to the translation request body

---

## Navigation Restructure

With 5 new screens (total 10), the bottom tab bar needs reorganization.

### New Layout
```
Bottom Tabs (5 main):
├── 📝 Text          (TextTranslateScreen)
├── 🗣️ Converse      (ConversationScreen)        ← NEW
├── 📷 Camera        (CameraTranslateScreen)
├── 📖 Phrases       (PhrasebookScreen)           ← NEW
├── ⚙️ More          (MoreScreen)                 ← NEW hub
    ├── 🎤 Voice     (VoiceTranslateScreen)
    ├── 🔤 Transliterate (TransliterateScreen)
    ├── 📄 Document  (DocumentTranslateScreen)    ← NEW
    ├── 📴 Offline   (OfflineSettingsScreen)      ← NEW
    └── 📜 History   (HistoryScreen)
```

#### [NEW] `mobile/src/screens/MoreScreen.js`
- Grid of icons linking to secondary screens
- Uses `@react-navigation/stack` for sub-navigation within the "More" tab

#### [MODIFY] `App.js`
- Bottom tabs reduced to 5 primary screens
- Stack navigator inside "More" tab for secondary screens

---

## Build Order (Recommended)

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | **Phrasebook** | 3-4 hours | High — instant unique content |
| 2 | **Conversation Mode** | 4-5 hours | Very High — killer feature |
| 3 | **Navigation Restructure** | 1-2 hours | Required for new screens |
| 4 | **Document Translation** | 3-4 hours | High — no competitor does this well |
| 5 | **Offline Mode** | 2-3 hours | Medium — caching layer |
| 6 | **Regional Dialects** | 4-5 hours | Very High — zero competition |

**Total estimated: ~18-23 hours of implementation**

---

## Verification Plan

### Per Feature
1. **Phrasebook**: Load all 5 categories, verify phrases in all 10 languages, test TTS playback
2. **Conversation Mode**: Two-device test simulating Tamil↔Hindi conversation
3. **Document Translation**: Upload sample PDF/DOCX/TXT, verify translated output
4. **Offline Mode**: Translate with internet → turn off WiFi → verify cached result returns
5. **Regional Dialects**: Translate "How are you?" to Bhojpuri vs standard Hindi, verify difference

### Integration
- All new screens accessible from navigation
- No regressions on existing Text/Voice/Camera/Transliterate screens
- Backend handles all new endpoints without crashing
