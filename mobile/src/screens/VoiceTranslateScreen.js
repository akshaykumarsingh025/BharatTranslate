import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LanguagePicker from '../components/LanguagePicker';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { TranslateAPI } from '../services/translateApi';

export default function VoiceTranslateScreen() {
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recording, setRecording] = useState(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        ).start();
    };

    const stopPulse = () => {
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
    };

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(recording);
                setIsListening(true);
                startPulse();
            } else {
                Alert.alert('Permission Denied', 'Microphone permission is required.');
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsListening(false);
        stopPulse();
        setIsLoading(true);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Send audio to AI Kosh ASR backend
            const transcribedText = await TranslateAPI.transcribeAudio(uri, sourceLang);

            if (transcribedText) {
                setSourceText(transcribedText);
                // Auto-translate after transcription
                const result = await TranslateAPI.translateText(transcribedText, sourceLang, targetLang);
                setTranslatedText(result);
            } else {
                Alert.alert('Error', 'Failed to recognize speech.');
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
        setIsLoading(false);
    };

    const handleMicPress = () => {
        if (isListening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;
        setIsLoading(true);
        setTranslatedText('');
        try {
            const result = await TranslateAPI.translateText(sourceText, sourceLang, targetLang);
            setTranslatedText(result);
        } catch (e) {
            setTranslatedText('Translation error.');
        }
        setIsLoading(false);
    };

    const getTTSLangCode = (lang) => {
        const map = {
            'en': 'en-US', 'hi': 'hi-IN', 'bn': 'bn-IN', 'ta': 'ta-IN', 'te': 'te-IN',
            'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN',
            'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN', 'sa': 'sa-IN', 'mai': 'mai-IN',
            'sd': 'sd-IN', 'kok': 'kok-IN', 'doi': 'doi-IN', 'mni': 'mni-IN', 'sat': 'sat-IN',
            'kas': 'ks-IN', 'brx': 'brx-IN'
        };
        return map[lang] || 'en-US';
    };

    const handleSpeak = (text, langCode) => {
        if (text) Speech.speak(text, { language: getTTSLangCode(langCode) });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🎤 Voice Translate</Text>
            </View>

            <View style={styles.languageBar}>
                <LanguagePicker selectedLanguage={sourceLang} onSelectLanguage={setSourceLang} />
                <Ionicons name="arrow-forward" size={24} color="#666" style={{ marginHorizontal: 10 }} />
                <LanguagePicker selectedLanguage={targetLang} onSelectLanguage={setTargetLang} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Big Mic Button */}
                <View style={styles.micSection}>
                    <Animated.View style={[styles.micOuter, { transform: [{ scale: pulseAnim }] }]}>
                        <TouchableOpacity
                            style={[styles.micButton, isListening && styles.micButtonActive]}
                            onPress={handleMicPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isListening ? 'radio' : 'mic'}
                                size={48}
                                color={isListening ? '#fff' : '#ff6b6b'}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.micLabel}>
                        {isListening ? '🔴 Listening...' : 'Tap to Speak'}
                    </Text>
                </View>

                {/* Text Input */}
                <Text style={styles.orDivider}>— or type below —</Text>
                <View style={styles.inputCard}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder={`Type in ${sourceLang}...`}
                        value={sourceText}
                        onChangeText={setSourceText}
                    />
                    {sourceText ? (
                        <TouchableOpacity style={styles.speakBtn} onPress={() => handleSpeak(sourceText, sourceLang)}>
                            <Ionicons name="volume-medium" size={22} color="#ff6b6b" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
                    <Ionicons name="language" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>

                {(translatedText || isLoading) ? (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>{targetLang}:</Text>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#ff6b6b" style={{ marginVertical: 20 }} />
                        ) : (
                            <>
                                <Text style={styles.resultText}>{translatedText}</Text>
                                <TouchableOpacity style={styles.speakBtn} onPress={() => handleSpeak(translatedText, targetLang)}>
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
    content: { padding: 16, alignItems: 'center' },
    micSection: { alignItems: 'center', marginVertical: 24 },
    micOuter: { marginBottom: 12 },
    micButton: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
        elevation: 6, shadowColor: '#ff6b6b', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, borderWidth: 3, borderColor: '#ff6b6b',
    },
    micButtonActive: { backgroundColor: '#ff4757', borderColor: '#ff4757' },
    micLabel: { fontSize: 16, fontWeight: 'bold', color: '#666' },
    orDivider: { fontSize: 13, color: '#aaa', marginVertical: 12, textAlign: 'center' },
    inputCard: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 14, paddingBottom: 40, minHeight: 80, elevation: 1, position: 'relative' },
    textInput: { fontSize: 16, color: '#333', minHeight: 60 },
    speakBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, position: 'absolute', bottom: 10, right: 10, padding: 6, zIndex: 10 },
    speakLabel: { fontSize: 12, color: '#ff6b6b', fontWeight: 'bold' },
    translateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ff6b6b', padding: 14, borderRadius: 8, marginVertical: 16, width: '100%', justifyContent: 'center' },
    translateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    resultCard: { width: '100%', backgroundColor: '#e9f5ff', borderRadius: 12, padding: 16, paddingBottom: 40, minHeight: 80, elevation: 1, position: 'relative' },
    resultLabel: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 8 },
    resultText: { fontSize: 22, color: '#333', fontWeight: '500', lineHeight: 32 },
});
