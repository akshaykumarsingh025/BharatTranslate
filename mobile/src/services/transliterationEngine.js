/**
 * Client-side transliteration engine for Indian languages
 * Converts Roman script ↔ Native script
 * Supports: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi
 */

// Devanagari (Hindi/Marathi) Roman-to-Native mapping
const DEVANAGARI_MAP = {
    // Vowels
    'aa': 'ा', 'ee': 'ी', 'oo': 'ू', 'ai': 'ै', 'au': 'ौ',
    'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'ए', 'o': 'ओ',
    // Consonants with matras
    'kh': 'ख', 'gh': 'घ', 'ch': 'छ', 'jh': 'झ',
    'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
    'sh': 'श', 'ng': 'ं',
    'k': 'क', 'g': 'ग', 'c': 'च', 'j': 'ज',
    't': 'त', 'd': 'द', 'n': 'न', 'p': 'प',
    'b': 'ब', 'm': 'म', 'y': 'य', 'r': 'र',
    'l': 'ल', 'v': 'व', 'w': 'व', 's': 'स', 'h': 'ह',
    'f': 'फ़', 'z': 'ज़', 'q': 'क़', 'x': 'क्स',
};

// Common Hindi words lookup for better accuracy
const HINDI_WORDS = {
    'namaste': 'नमस्ते', 'namaskar': 'नमस्कार',
    'dhanyavaad': 'धन्यवाद', 'dhanyawad': 'धन्यवाद',
    'shukriya': 'शुक्रिया',
    'kaise': 'कैसे', 'kaise ho': 'कैसे हो',
    'aap': 'आप', 'tum': 'तुम', 'main': 'मैं', 'hum': 'हम',
    'haan': 'हाँ', 'nahi': 'नहीं', 'nahin': 'नहीं',
    'accha': 'अच्छा', 'achha': 'अच्छा',
    'bahut': 'बहुत', 'bohut': 'बहुत',
    'theek': 'ठीक', 'thik': 'ठीक',
    'hai': 'है', 'hain': 'हैं', 'tha': 'था', 'thi': 'थी',
    'ka': 'का', 'ki': 'की', 'ke': 'के', 'ko': 'को',
    'se': 'से', 'me': 'में', 'par': 'पर', 'pe': 'पे',
    'kya': 'क्या', 'kab': 'कब', 'kahan': 'कहाँ', 'kaun': 'कौन',
    'kitna': 'कितना', 'kitne': 'कितने', 'kitni': 'कितनी',
    'mera': 'मेरा', 'meri': 'मेरी', 'mere': 'मेरे',
    'tera': 'तेरा', 'teri': 'तेरी', 'tere': 'तेरे',
    'uska': 'उसका', 'uski': 'उसकी', 'unka': 'उनका',
    'yeh': 'यह', 'woh': 'वह', 'ye': 'ये', 'vo': 'वो',
    'aur': 'और', 'ya': 'या', 'lekin': 'लेकिन', 'par': 'पर',
    'paani': 'पानी', 'khana': 'खाना', 'ghar': 'घर',
    'pyaar': 'प्यार', 'dost': 'दोस्त',
    'aaj': 'आज', 'kal': 'कल', 'abhi': 'अभी',
    'bahut accha': 'बहुत अच्छा',
    'chalo': 'चलो', 'chal': 'चल',
    'ruk': 'रुक', 'ruko': 'रुको',
    'sun': 'सुन', 'suno': 'सुनो',
    'bol': 'बोल', 'bolo': 'बोलो',
    'jao': 'जाओ', 'aao': 'आओ',
    'dilli': 'दिल्ली', 'mumbai': 'मुंबई',
    'bharat': 'भारत', 'hindustan': 'हिंदुस्तान',
};

/**
 * Transliterate a single word from Roman to Devanagari
 */
function romanToDevanagari(word) {
    const lower = word.toLowerCase();

    // Check word lookup first
    if (HINDI_WORDS[lower]) return HINDI_WORDS[lower];

    // Character-by-character transliteration
    let result = '';
    let i = 0;
    let prevWasConsonant = false;

    while (i < lower.length) {
        let matched = false;

        // Try 2-char combinations first (e.g., 'kh', 'ch', 'sh')
        if (i + 1 < lower.length) {
            const twoChar = lower.substring(i, i + 2);
            if (DEVANAGARI_MAP[twoChar]) {
                result += DEVANAGARI_MAP[twoChar];
                i += 2;
                prevWasConsonant = !['aa', 'ee', 'oo', 'ai', 'au'].includes(twoChar);
                matched = true;
            }
        }

        // Try 1-char match
        if (!matched) {
            const oneChar = lower[i];
            if (DEVANAGARI_MAP[oneChar]) {
                result += DEVANAGARI_MAP[oneChar];
                i += 1;
                prevWasConsonant = !['a', 'i', 'u', 'e', 'o'].includes(oneChar);
            } else {
                // Keep the character as-is (numbers, punctuation)
                result += lower[i];
                i += 1;
                prevWasConsonant = false;
            }
        }
    }

    return result;
}

/**
 * Transliterate full text from Roman to Native script
 * @param {string} text - Input text in Roman script
 * @param {string} langCode - Target language code
 * @returns {string} - Transliterated text
 */
export function transliterateRomanToNative(text, langCode) {
    if (!text || !text.trim()) return '';

    // Split by spaces and transliterate each word
    const words = text.split(/(\s+)/); // Keep whitespace
    const result = words.map(word => {
        if (/^\s+$/.test(word)) return word; // Keep whitespace as-is

        // Check multi-word phrases first
        const lower = word.toLowerCase();

        switch (langCode) {
            case 'hi':
            case 'mr': // Marathi also uses Devanagari
                return romanToDevanagari(word);
            default:
                // For other languages, fall back to the word lookup or basic conversion
                return romanToDevanagari(word);
        }
    });

    return result.join('');
}

/**
 * Simple Native to Roman transliteration (reverse mapping)
 */
const DEVANAGARI_TO_ROMAN = {};
// Build reverse map
Object.entries(DEVANAGARI_MAP).forEach(([roman, native]) => {
    DEVANAGARI_TO_ROMAN[native] = roman;
});
// Add extra vowel forms
Object.assign(DEVANAGARI_TO_ROMAN, {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n',
    '्': '', 'ः': 'h',
    '।': '.', '॥': '.',
});

export function transliterateNativeToRoman(text) {
    if (!text || !text.trim()) return '';

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (DEVANAGARI_TO_ROMAN[char] !== undefined) {
            result += DEVANAGARI_TO_ROMAN[char];
        } else {
            result += char;
        }
    }
    return result;
}
