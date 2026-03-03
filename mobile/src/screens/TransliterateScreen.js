import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LanguagePicker from '../components/LanguagePicker';
import * as Clipboard from 'expo-clipboard';
import { transliterateRomanToNative, transliterateNativeToRoman } from '../services/transliterationEngine';

export default function TransliterateScreen() {
    const [language, setLanguage] = useState('hi');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('Roman → Native');

    const handleTransliterate = () => {
        if (!inputText.trim()) {
            setOutputText('');
            return;
        }

        let result;
        if (mode === 'Roman → Native') {
            result = transliterateRomanToNative(inputText, language);
        } else {
            result = transliterateNativeToRoman(inputText);
        }
        setOutputText(result);
    };

    // Live transliteration as user types
    const handleTextChange = (text) => {
        setInputText(text);
        if (!text.trim()) {
            setOutputText('');
            return;
        }
        if (mode === 'Roman → Native') {
            setOutputText(transliterateRomanToNative(text, language));
        } else {
            setOutputText(transliterateNativeToRoman(text));
        }
    };

    const copyToClipboard = async () => {
        if (outputText) {
            await Clipboard.setStringAsync(outputText);
            Alert.alert('Copied', 'Text copied to clipboard!');
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'Roman → Native' ? 'Native → Roman' : 'Roman → Native');
        setInputText('');
        setOutputText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transliterate 🔤</Text>
                <Text style={styles.headerSubtitle}>Convert between scripts (not translation)</Text>
            </View>

            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
                    <Ionicons name="swap-vertical" size={20} color="#ff6b6b" />
                    <Text style={styles.modeText}>{mode}</Text>
                </TouchableOpacity>

                <View style={styles.langRow}>
                    <Text style={styles.label}>Script: </Text>
                    <LanguagePicker selectedLanguage={language} onSelectLanguage={setLanguage} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>
                    {mode === 'Roman → Native'
                        ? '✏️ Type in English/Roman letters:'
                        : '✏️ Type in native script:'}
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder={mode === 'Roman → Native'
                            ? 'e.g. namaste, kaise ho, dhanyavaad'
                            : 'e.g. नमस्ते, कैसे हो'}
                        value={inputText}
                        onChangeText={handleTextChange}
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    {mode === 'Roman → Native'
                        ? `📝 ${language} script:`
                        : '📝 Roman script:'}
                </Text>
                <View style={styles.outputContainer}>
                    <Text style={styles.outputText}>
                        {outputText || (mode === 'Roman → Native'
                            ? 'Devanagari/native text will appear here as you type'
                            : 'Romanized text will appear here as you type')}
                    </Text>
                    {outputText ? (
                        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                            <Ionicons name="copy-outline" size={20} color="#ff6b6b" />
                            <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.examplesBox}>
                    <Text style={styles.examplesTitle}>💡 Try these:</Text>
                    {['namaste', 'kaise ho', 'dhanyavaad', 'bahut accha', 'paani', 'bharat'].map((word, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.exampleChip}
                            onPress={() => handleTextChange(word)}
                        >
                            <Text style={styles.exampleText}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 4 },
    settingsContainer: { backgroundColor: '#fff', padding: 16, marginTop: 1 },
    modeButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#fff3f3', padding: 10, borderRadius: 8 },
    modeText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 8 },
    langRow: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 16, color: '#333' },
    content: { padding: 16 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#444' },
    inputContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, minHeight: 100, elevation: 1, marginBottom: 16 },
    textInput: { fontSize: 18, flex: 1 },
    outputContainer: { backgroundColor: '#e9f5ff', borderRadius: 8, padding: 12, minHeight: 100, elevation: 1, position: 'relative', paddingBottom: 40 },
    outputText: { fontSize: 22, color: '#333', lineHeight: 32 },
    copyButton: { position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, elevation: 1 },
    copyButtonText: { color: '#ff6b6b', marginLeft: 4, fontWeight: 'bold' },
    examplesBox: { marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    examplesTitle: { width: '100%', fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 4 },
    exampleChip: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 1, borderWidth: 1, borderColor: '#eee' },
    exampleText: { fontSize: 14, color: '#333' },
});
