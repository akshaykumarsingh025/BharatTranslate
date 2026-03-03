import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('bharattranslate.db');
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_text TEXT NOT NULL,
        source_lang TEXT NOT NULL,
        target_lang TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }
};

export const getCachedTranslation = async (sourceText, sourceLang, targetLang) => {
    if (!db) await initDB();
    const result = await db.getAllAsync(
        `SELECT translated_text FROM translations 
     WHERE source_text = ? AND source_lang = ? AND target_lang = ? 
     ORDER BY timestamp DESC LIMIT 1`,
        [sourceText, sourceLang, targetLang]
    );
    return result.length > 0 ? result[0].translated_text : null;
};

export const cacheTranslation = async (sourceText, sourceLang, targetLang, translatedText) => {
    if (!db) await initDB();
    await db.runAsync(
        `INSERT INTO translations (source_text, source_lang, target_lang, translated_text) 
     VALUES (?, ?, ?, ?)`,
        [sourceText, sourceLang, targetLang, translatedText]
    );
};

export const clearCache = async (sourceLang, targetLang) => {
    if (!db) await initDB();
    if (sourceLang && targetLang) {
        await db.runAsync(
            `DELETE FROM translations WHERE source_lang = ? AND target_lang = ?`,
            [sourceLang, targetLang]
        );
    } else {
        await db.execAsync(`DELETE FROM translations;`);
    }
}

export const getCacheSize = async () => {
    if (!db) await initDB();
    const result = await db.getAllAsync(`SELECT COUNT(*) as count FROM translations;`);
    return result[0].count;
}
