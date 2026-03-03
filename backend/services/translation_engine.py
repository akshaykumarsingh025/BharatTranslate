"""
Translation Engine — powered by AI Kosh IndicTrans2
Model: ai4bharat/indictrans2-en-indic-1B (English→Indic)
       ai4bharat/indictrans2-indic-en-1B (Indic→English)
       ai4bharat/indictrans2-indic-indic-1B (Indic↔Indic)
"""
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Language code mapping: our codes → IndicTrans2 codes
# All 22 languages supported by IndicTrans2 (en-indic, indic-en, indic-indic models)
LANG_CODE_MAP = {
    # Original 10
    "en": "eng_Latn",
    "hi": "hin_Deva",
    "bn": "ben_Beng",
    "ta": "tam_Taml",
    "te": "tel_Telu",
    "mr": "mar_Deva",
    "gu": "guj_Gujr",
    "kn": "kan_Knda",
    "ml": "mal_Mlym",
    "pa": "pan_Guru",
    # Additional 12
    "or": "ory_Orya",
    "as": "asm_Beng",
    "ur": "urd_Arab",
    "sa": "san_Deva",
    "mai": "mai_Deva",
    "sd": "snd_Arab",
    "kok": "kok_Deva",
    "doi": "doi_Deva",
    "mni": "mni_Beng",
    "sat": "sat_Olck",
    "kas": "kas_Arab",
    "brx": "brx_Deva",
}

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


class TranslationEngine:
    def __init__(self):
        self._models = {}
        self._tokenizers = {}
        self._processor = None
        self._loaded = False

    def _get_model_name(self, src_lang: str, tgt_lang: str) -> str:
        """Pick the right IndicTrans2 model based on language pair."""
        src_is_en = src_lang == "en"
        tgt_is_en = tgt_lang == "en"

        if src_is_en and not tgt_is_en:
            return "ai4bharat/indictrans2-en-indic-1B"
        elif not src_is_en and tgt_is_en:
            return "ai4bharat/indictrans2-indic-en-1B"
        else:
            return "ai4bharat/indictrans2-indic-indic-1B"

    def _load_model(self, model_name: str):
        """Load model and tokenizer on first use (lazy loading)."""
        if model_name in self._models:
            return

        print(f"[TranslationEngine] Loading model: {model_name} ...")
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name,
            trust_remote_code=True,
            torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
        ).to(DEVICE)
        model.eval()

        self._models[model_name] = model
        self._tokenizers[model_name] = tokenizer
        self._loaded = True
        print(f"[TranslationEngine] Model loaded: {model_name} on {DEVICE}")

    def _get_processor(self):
        """Load IndicProcessor (from IndicTransToolkit)."""
        if self._processor is None:
            from IndicTransToolkit.processor import IndicProcessor
            self._processor = IndicProcessor(inference=True)
        return self._processor

    def is_loaded(self) -> bool:
        return self._loaded

    async def translate(self, text: str, src_lang: str, tgt_lang: str) -> str:
        """Translate text between any supported language pair."""
        if not text or not text.strip():
            return ""
        if src_lang == tgt_lang:
            return text

        src_code = LANG_CODE_MAP.get(src_lang)
        tgt_code = LANG_CODE_MAP.get(tgt_lang)
        if not src_code or not tgt_code:
            return f"Unsupported language: {src_lang} or {tgt_lang}"

        model_name = self._get_model_name(src_lang, tgt_lang)
        self._load_model(model_name)

        model = self._models[model_name]
        tokenizer = self._tokenizers[model_name]
        ip = self._get_processor()

        # Preprocess
        batch = ip.preprocess_batch([text], src_lang=src_code, tgt_lang=tgt_code)

        # Tokenize
        inputs = tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt",
            return_attention_mask=True,
        ).to(DEVICE)

        # Generate
        with torch.no_grad():
            generated_tokens = model.generate(
                **inputs,
                use_cache=True,
                min_length=0,
                max_length=256,
                num_beams=5,
                num_return_sequences=1,
            )

        # Decode
        decoded = tokenizer.batch_decode(
            generated_tokens,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

        # Postprocess
        translations = ip.postprocess_batch(decoded, lang=tgt_code)
        return translations[0] if translations else text


# Singleton
translation_engine = TranslationEngine()
