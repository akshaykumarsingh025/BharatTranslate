/**
 * Tests for the transliteration engine
 * Verifies that Roman text is correctly converted to Devanagari
 *
 * Run: npx jest src/__tests__/transliteration.test.js --verbose
 */

const { transliterateRomanToNative, transliterateNativeToRoman } = require('../services/transliterationEngine');

describe('transliterateRomanToNative (Hindi)', () => {

    test('"namaste" → "नमस्ते"', () => {
        const result = transliterateRomanToNative('namaste', 'hi');
        expect(result).toBe('नमस्ते');
    });

    test('"dhanyavaad" → "धन्यवाद"', () => {
        const result = transliterateRomanToNative('dhanyavaad', 'hi');
        expect(result).toBe('धन्यवाद');
    });

    test('"kaise ho" → "कैसे हो" (multi-word)', () => {
        const result = transliterateRomanToNative('kaise ho', 'hi');
        // Both should be looked up from dict
        expect(result).toContain('कैसे');
    });

    test('"bharat" → "भारत"', () => {
        const result = transliterateRomanToNative('bharat', 'hi');
        expect(result).toBe('भारत');
    });

    test('"paani" → "पानी"', () => {
        const result = transliterateRomanToNative('paani', 'hi');
        expect(result).toBe('पानी');
    });

    test('"bahut accha" → contains "बहुत" and "अच्छा"', () => {
        const result = transliterateRomanToNative('bahut accha', 'hi');
        expect(result).toContain('बहुत');
        expect(result).toContain('अच्छा');
    });

    test('preserves whitespace between words', () => {
        const result = transliterateRomanToNative('haan nahi', 'hi');
        expect(result).toContain(' ');
    });

    test('returns empty string for empty input', () => {
        expect(transliterateRomanToNative('', 'hi')).toBe('');
    });

    test('returns empty string for whitespace input', () => {
        expect(transliterateRomanToNative('   ', 'hi')).toBe('');
    });

    test('unknown words are still converted character-by-character', () => {
        const result = transliterateRomanToNative('xyz', 'hi');
        expect(result).toBeTruthy();
        expect(result).not.toBe('xyz'); // Should be converted to some Devanagari
        console.log('  "xyz" =>', result);
    });
});

describe('transliterateNativeToRoman', () => {

    test('converts Devanagari characters to Roman', () => {
        const result = transliterateNativeToRoman('अ');
        expect(result).toBe('a');
    });

    test('returns empty for empty input', () => {
        expect(transliterateNativeToRoman('')).toBe('');
    });
});
