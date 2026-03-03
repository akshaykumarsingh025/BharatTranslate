import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import LanguagePicker from '../components/LanguagePicker';

const BASE_URL = 'http://192.168.1.33:8000/v1'; // Update to remote when deployed

export default function DocumentTranslateScreen() {
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [originalText, setOriginalText] = useState('');

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            setSelectedFile(file);
            setTranslatedText('');
            setOriginalText('');
        } catch (err) {
            console.error('Error picking document', err);
        }
    };

    const uploadAndTranslate = async () => {
        if (!selectedFile) {
            Alert.alert('No file selected', 'Please select a document first.');
            return;
        }

        setIsTranslating(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType || 'application/octet-stream',
            });
            formData.append('source_lang', sourceLang);
            formData.append('target_lang', targetLang);

            const response = await fetch(`${BASE_URL}/document/translate`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setOriginalText(data.original_text);
            setTranslatedText(data.translated_text);
        } catch (error) {
            console.error('Document translation error:', error);
            Alert.alert('Translation Failed', 'Could not translate document. Check your connection or file size.');
        } finally {
            setIsTranslating(false);
        }
    };

    const downloadTranslatedText = async () => {
        if (!translatedText) return;
        try {
            const fileUri = `${FileSystem.documentDirectory}translated_${selectedFile.name}.txt`;
            await FileSystem.writeAsStringAsync(fileUri, translatedText, { encoding: FileSystem.EncodingType.UTF8 });
            Alert.alert('Downloaded', `Translated file saved to ${fileUri}`);
        } catch (error) {
            Alert.alert('Download Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.langPickerWrap}>
                    <Text style={styles.langLabel}>From</Text>
                    <LanguagePicker selectedLanguage={sourceLang} onSelectLanguage={setSourceLang} />
                </View>
                <View style={styles.langPickerWrap}>
                    <Text style={styles.langLabel}>To</Text>
                    <LanguagePicker selectedLanguage={targetLang} onSelectLanguage={setTargetLang} />
                </View>
            </View>

            {!translatedText && !isTranslating && (
                <View style={styles.uploadContainer}>
                    <Ionicons name="document-text" size={64} color="#ccc" style={{ marginBottom: 10 }} />
                    {selectedFile ? (
                        <>
                            <Text style={styles.fileName}>{selectedFile.name}</Text>
                            <Text style={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>

                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.buttonOutline} onPress={pickDocument}>
                                    <Text style={styles.buttonOutlineText}>Change File</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={uploadAndTranslate}>
                                    <Text style={styles.buttonText}>Translate</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.instructionText}>Select a PDF, DOCX, or TXT file to translate.</Text>
                            <TouchableOpacity style={styles.button} onPress={pickDocument}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonText}>Select Document</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}

            {isTranslating && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff6b6b" />
                    <Text style={styles.loadingText}>Extracting and Translating Document...</Text>
                </View>
            )}

            {translatedText && !isTranslating && (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsTitle}>Translation Result</Text>
                        <TouchableOpacity style={styles.downloadButton} onPress={downloadTranslatedText}>
                            <Ionicons name="download" size={18} color="#fff" />
                            <Text style={styles.downloadText}>Save TXT</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.resultLabel}>Original ({sourceLang}):</Text>
                        <Text style={styles.originalTextPreview}>{originalText.substring(0, 200)}...</Text>

                        <View style={styles.divider} />

                        <Text style={styles.resultLabel}>Translated ({targetLang}):</Text>
                        <Text style={styles.translatedTextPreview}>{translatedText}</Text>
                    </ScrollView>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
    },
    langPickerWrap: { flex: 1, alignItems: 'center' },
    langLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
    uploadContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    instructionText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
    fileName: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
    fileSize: { fontSize: 14, color: '#888', marginBottom: 20 },
    button: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    buttonOutline: {
        borderWidth: 1,
        borderColor: '#ff6b6b',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    buttonOutlineText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
    actionRow: { flexDirection: 'row', justifyContent: 'center' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: '#666', marginTop: 15 },
    resultsContainer: { flex: 1, padding: 15 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    resultsTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    downloadButton: {
        backgroundColor: '#4dabf7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    downloadText: { color: '#fff', fontWeight: '600', marginLeft: 5 },
    scrollView: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 1 },
    resultLabel: { fontSize: 14, color: '#888', fontWeight: 'bold', marginBottom: 5 },
    originalTextPreview: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 15 },
    translatedTextPreview: { fontSize: 16, color: '#333', lineHeight: 24, paddingBottom: 30 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
});
