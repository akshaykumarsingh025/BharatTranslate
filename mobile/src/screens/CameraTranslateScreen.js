import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LanguagePicker from '../components/LanguagePicker';
import { TranslateAPI } from '../services/translateApi';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

export default function CameraTranslateScreen() {
    const [sourceLang, setSourceLang] = useState({ code: 'en', name: 'English' });
    const [targetLang, setTargetLang] = useState({ code: 'hi', name: 'Hindi' });
    const [imageUri, setImageUri] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const extractText = async (uri) => {
        setIsLoading(true);
        try {
            const result = await TranslateAPI.extractTextFromImage(uri, sourceLang.code);
            if (result) {
                setExtractedText(result);
                // Also kick off translation automatically
                const translated = await TranslateAPI.translateText(result, sourceLang.code, targetLang.code);
                setTranslatedText(translated);
            } else {
                Alert.alert('Extration Error', 'Could not read text from image.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while processing the image.');
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission Denied', 'Camera permission is needed.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            setTranslatedText('');
            setExtractedText('');
            extractText(uri);
        }
    };

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            setTranslatedText('');
            setExtractedText('');
            extractText(uri);
        }
    };

    const handleTranslate = async () => {
        if (!extractedText.trim()) return;
        setIsLoading(true);
        try {
            const result = await TranslateAPI.translateText(extractedText, sourceLang.code, targetLang.code);
            setTranslatedText(result);
        } catch (e) {
            setTranslatedText('Translation error.');
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📷 Camera Translate</Text>
            </View>

            <View style={styles.languageBar}>
                <LanguagePicker selectedLang={sourceLang} onSelect={setSourceLang} />
                <Ionicons name="arrow-forward" size={24} color="#666" style={{ marginHorizontal: 10 }} />
                <LanguagePicker selectedLang={targetLang} onSelect={setTargetLang} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {imageUri ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
                        <TouchableOpacity style={styles.retakeBtn} onPress={() => { setImageUri(null); setExtractedText(''); setTranslatedText(''); }}>
                            <Ionicons name="close-circle" size={28} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.cameraBox}>
                        <Ionicons name="camera-outline" size={64} color="#666" />
                        <Text style={styles.cameraText}>Capture or pick an image</Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.actionBtnText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.galleryBtn]} onPress={pickFromGallery}>
                        <Ionicons name="images" size={20} color="#fff" />
                        <Text style={styles.actionBtnText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>Type the text from image:</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Type the text here..."
                        value={extractedText}
                        onChangeText={setExtractedText}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.translateButton, !extractedText.trim() && styles.translateButtonDisabled]}
                    onPress={handleTranslate}
                    disabled={!extractedText.trim()}
                >
                    <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>

                {(translatedText || isLoading) ? (
                    <View style={styles.outputBox}>
                        <Text style={styles.outputLabel}>{targetLang.name}:</Text>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#ff6b6b" />
                        ) : (
                            <>
                                <Text style={styles.outputText}>{translatedText}</Text>
                                <TouchableOpacity style={styles.speakBtn} onPress={() => Speech.speak(translatedText, { language: targetLang.code })}>
                                    <Ionicons name="volume-medium" size={24} color="#ff6b6b" />
                                    <Text style={styles.speakLabel}>Listen</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    languageBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff', marginTop: 1 },
    content: { padding: 16 },
    cameraBox: { height: 180, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 1, borderWidth: 2, borderColor: '#eee', borderStyle: 'dashed' },
    cameraText: { color: '#888', marginTop: 12, fontSize: 14 },
    imageWrapper: { position: 'relative', marginBottom: 12 },
    imagePreview: { height: 200, borderRadius: 12, backgroundColor: '#222' },
    retakeBtn: { position: 'absolute', top: 8, right: 8 },
    buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    actionBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#ff6b6b', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8 },
    galleryBtn: { backgroundColor: '#4a90d9' },
    actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    inputBox: { backgroundColor: '#fff', borderRadius: 8, padding: 12, minHeight: 80, elevation: 1, marginBottom: 12 },
    textInput: { fontSize: 16 },
    translateButton: { backgroundColor: '#ff6b6b', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
    translateButtonDisabled: { backgroundColor: '#ccc' },
    translateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    outputBox: { backgroundColor: '#e9f5ff', borderRadius: 12, padding: 16, minHeight: 80, elevation: 1 },
    outputLabel: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 8 },
    outputText: { fontSize: 20, color: '#333', lineHeight: 28 },
    speakBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
    speakLabel: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 14 },
});
