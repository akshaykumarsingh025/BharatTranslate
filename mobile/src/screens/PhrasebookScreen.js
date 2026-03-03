import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import phrasebookData from '../data/phrasebook.json';
import LanguagePicker from '../components/LanguagePicker';

const ttsLangMap = {
    'en': 'en-US', 'hi': 'hi-IN', 'bn': 'bn-IN', 'ta': 'ta-IN', 'te': 'te-IN',
    'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN',
    'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN', 'sa': 'sa-IN', 'mai': 'mai-IN',
    'sd': 'sd-IN', 'kok': 'kok-IN', 'doi': 'doi-IN', 'mni': 'mni-IN', 'sat': 'sat-IN',
    'kas': 'ks-IN', 'brx': 'brx-IN'
};

export default function PhrasebookScreen() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');

    const speak = (text, lang) => {
        Speech.speak(text, { language: ttsLangMap[lang] || 'en-US' });
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(item)}
        >
            <Ionicons name={item.icon} size={32} color="#4dabf7" />
            <Text style={styles.categoryTitle}>{item.category}</Text>
            <Text style={styles.phraseCount}>{item.phrases.length} phrases</Text>
        </TouchableOpacity>
    );

    const renderPhrase = ({ item }) => (
        <View style={styles.phraseCard}>
            <View style={styles.phraseHeader}>
                <Text style={styles.sourceText}>{item[sourceLang] || item['en']}</Text>
                <TouchableOpacity onPress={() => speak(item[sourceLang] || item['en'], sourceLang)}>
                    <Ionicons name="volume-medium" size={24} color="#666" />
                </TouchableOpacity>
            </View>
            <View style={styles.phraseFooter}>
                <Text style={styles.targetText}>{item[targetLang]}</Text>
                <TouchableOpacity onPress={() => speak(item[targetLang], targetLang)}>
                    <Ionicons name="volume-high" size={24} color="#ff6b6b" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {!selectedCategory ? (
                <>
                    <Text style={styles.headerTitle}>Phrasebook</Text>
                    <FlatList
                        data={phrasebookData}
                        keyExtractor={item => item.category}
                        numColumns={2}
                        renderItem={renderCategory}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            ) : (
                <View style={styles.phrasesContainer}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitleSmall}>{selectedCategory.category}</Text>
                    </View>

                    <View style={styles.langSelectors}>
                        <View style={styles.langPickerWrap}>
                            <Text style={styles.langLabel}>From</Text>
                            <LanguagePicker selectedLanguage={sourceLang} onSelectLanguage={setSourceLang} />
                        </View>
                        <View style={styles.langPickerWrap}>
                            <Text style={styles.langLabel}>To</Text>
                            <LanguagePicker selectedLanguage={targetLang} onSelectLanguage={setTargetLang} />
                        </View>
                    </View>

                    <FlatList
                        data={selectedCategory.phrases}
                        keyExtractor={item => item.id}
                        renderItem={renderPhrase}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', margin: 20, marginTop: 50, color: '#333' },
    headerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', elevation: 2 },
    backButton: { marginRight: 10 },
    headerTitleSmall: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    listContainer: { padding: 10 },
    categoryCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 8,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    categoryTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#333' },
    phraseCount: { fontSize: 12, color: '#888', marginTop: 5 },
    phrasesContainer: { flex: 1 },
    langSelectors: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
    langPickerWrap: { alignItems: 'center', flex: 1 },
    langLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
    phraseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        elevation: 2,
    },
    phraseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#eee' },
    phraseFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sourceText: { fontSize: 14, color: '#666', flex: 1, marginRight: 10 },
    targetText: { fontSize: 18, color: '#333', fontWeight: '500', flex: 1, marginRight: 10 },
});
