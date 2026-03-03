/**
 * Unit tests for the TranslateAPI service
 *
 * These tests verify the core translation flow by making real API calls
 * to the MyMemory translation API to ensure actual translations are returned.
 *
 * Run with: npx jest src/__tests__/translateApi.test.js
 */

const { TranslateAPI } = require('../services/translateApi');

// Increase timeout for network calls
jest.setTimeout(15000);

describe('TranslateAPI.translateText', () => {

    test('translates "Hello" from English to Hindi', async () => {
        const result = await TranslateAPI.translateText('Hello', 'en', 'hi');
        expect(result).toBeTruthy();
        expect(result).not.toBe('Hello'); // Should NOT return the same text
        expect(result.toLowerCase()).not.toContain('error');
        console.log('  en→hi "Hello" =>', result);
    });

    test('translates "Good morning" from English to Tamil', async () => {
        const result = await TranslateAPI.translateText('Good morning', 'en', 'ta');
        expect(result).toBeTruthy();
        expect(result).not.toBe('Good morning');
        expect(result.toLowerCase()).not.toContain('error');
        console.log('  en→ta "Good morning" =>', result);
    });

    test('translates "Thank you" from English to Bengali', async () => {
        const result = await TranslateAPI.translateText('Thank you', 'en', 'bn');
        expect(result).toBeTruthy();
        expect(result).not.toBe('Thank you');
        console.log('  en→bn "Thank you" =>', result);
    });

    test('translates between two Indian languages (Hindi to Tamil)', async () => {
        const result = await TranslateAPI.translateText('नमस्ते', 'hi', 'ta');
        expect(result).toBeTruthy();
        expect(result).not.toBe('नमस्ते');
        console.log('  hi→ta "नमस्ते" =>', result);
    });

    test('returns empty string for empty input', async () => {
        const result = await TranslateAPI.translateText('', 'en', 'hi');
        expect(result).toBe('');
    });

    test('returns empty string for whitespace-only input', async () => {
        const result = await TranslateAPI.translateText('   ', 'en', 'hi');
        expect(result).toBe('');
    });

    test('returns same text when source and target language are the same', async () => {
        const result = await TranslateAPI.translateText('Hello', 'en', 'en');
        expect(result).toBe('Hello');
    });
});

describe('TranslateAPI.transliterate', () => {

    test('transliterates "namaste" Roman → Hindi', async () => {
        const result = await TranslateAPI.transliterate('namaste', 'hi', 'Roman → Native');
        expect(result).toBeTruthy();
        expect(result).not.toBe('namaste');
        console.log('  Roman→Hindi "namaste" =>', result);
    });

    test('transliterates "dhanyavaad" Roman → Hindi', async () => {
        const result = await TranslateAPI.transliterate('dhanyavaad', 'hi', 'Roman → Native');
        expect(result).toBeTruthy();
        console.log('  Roman→Hindi "dhanyavaad" =>', result);
    });

    test('returns empty string for empty input', async () => {
        const result = await TranslateAPI.transliterate('', 'hi', 'Roman → Native');
        expect(result).toBe('');
    });
});

describe('TranslateAPI.toggleFavorite', () => {

    test('returns true when toggling favorite', async () => {
        const result = await TranslateAPI.toggleFavorite('test-id', true);
        expect(result).toBe(true);
    });
});
