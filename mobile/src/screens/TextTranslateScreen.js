import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LanguagePicker from '../components/LanguagePicker';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { TranslateAPI } from '../services/translateApi';

export default function TextTranslateScreen() {
    const [sourceLang, setSourceLang] = useState({ code: 'en', name: 'English' });
    const [targetLang, setTargetLang] = useState({ code: 'hi', name: 'Hindi' });
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setTranslatedText('');
            return;
        }
        setTranslatedText('Translating...');
        const result = await TranslateAPI.translateText(inputText, sourceLang.code, targetLang.code);
        setTranslatedText(result);
    };

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        const tempText = inputText;
        setInputText(translatedText);
        setTranslatedText(tempText);
    };

    const handleSpeak = () => {
        if (translatedText && translatedText !== 'Translating...') {
            Speech.speak(translatedText, { language: targetLang.code });
        }
    };

    const handleCopy = async () => {
        if (translatedText && translatedText !== 'Translating...') {
            await Clipboard.setStringAsync(translatedText);
            Alert.alert("Copied", "Translation copied to clipboard!");
        }
    };

    const handleFavorite = async () => {
        if (translatedText && translatedText !== 'Translating...') {
            const newFavStatus = !isFavorite;
            setIsFavorite(newFavStatus);
            await TranslateAPI.toggleFavorite('trans_id_dummy', newFavStatus);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🌐 BharatTranslate ⚙️</Text>
            </View>

            <View style={styles.languageBar}>
                <LanguagePicker selectedLang={sourceLang} onSelect={setSourceLang} />
                <TouchableOpacity onPress={handleSwapLanguages} style={styles.swapButton}>
                    <Ionicons name="swap-horizontal" size={24} color="#ff6b6b" />
                </TouchableOpacity>
                <LanguagePicker selectedLang={targetLang} onSelect={setTargetLang} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Type or paste text here..."
                    value={inputText}
                    onChangeText={setInputText}
                />
            </View>

            <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
                <Text style={styles.translateButtonText}>Translate</Text>
            </TouchableOpacity>

            <View style={styles.outputContainer}>
                <Text style={styles.outputText}>
                    {translatedText || 'Translation will appear here'}
                </Text>
                <View style={styles.actionsBar}>
                    <TouchableOpacity onPress={handleSpeak}>
                        <Ionicons name="volume-high-outline" size={24} color={translatedText ? "#ff6b6b" : "#ccc"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCopy}>
                        <Ionicons name="copy-outline" size={24} color={translatedText ? "#333" : "#ccc"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite}>
                        <Ionicons name={isFavorite ? "star" : "star-outline"} size={24} color={isFavorite ? "#ffd700" : (translatedText ? "#333" : "#ccc")} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.recentSection}>
                <Text style={styles.recentTitle}>Recent Translations</Text>
                <Text style={styles.recentItem}>• Hello → नमस्ते</Text>
                <Text style={styles.recentItem}>• Thank you → धन्यवाद</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    languageBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', marginTop: 1 },
    swapButton: { padding: 8 },
    inputContainer: { backgroundColor: '#fff', margin: 16, borderRadius: 8, padding: 12, minHeight: 150, elevation: 1 },
    textInput: { fontSize: 16, flex: 1 },
    translateButton: { backgroundColor: '#ff6b6b', marginHorizontal: 16, padding: 14, borderRadius: 8, alignItems: 'center' },
    translateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    outputContainer: { backgroundColor: '#e9f5ff', margin: 16, borderRadius: 8, padding: 12, minHeight: 150, elevation: 1 },
    outputText: { fontSize: 16, color: '#333', flex: 1 },
    actionsBar: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
    recentSection: { padding: 16 },
    recentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    recentItem: { fontSize: 14, color: '#666', marginBottom: 4 }
});
