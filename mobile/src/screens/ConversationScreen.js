import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import LanguagePicker from '../components/LanguagePicker';
import { TranslateAPI } from '../services/translateApi';

export default function ConversationScreen() {
    const [langA, setLangA] = useState('en');
    const [langB, setLangB] = useState('hi');
    const [isRecording, setIsRecording] = useState(false);
    const [activePerson, setActivePerson] = useState(null); // 'A' or 'B'
    const [isTranslating, setIsTranslating] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [recording, setRecording] = useState(null);

    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [recording]);

    const startRecording = async (personInfo) => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
            setActivePerson(personInfo);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecordingAndTranslate = async () => {
        if (!recording) return;

        setIsRecording(false);
        setIsTranslating(true);

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Simulate ASR here if we don't have the audio upload endpoint hooked up yet
            // In a real app we'd upload this to /v1/asr/transcribe
            const simulatedSourceText = activePerson === 'A' ? "Hello, how are you?" : "मैं ठीक हूँ, धन्यवाद।";
            const sourceLang = activePerson === 'A' ? langA : langB;
            const targetLang = activePerson === 'A' ? langB : langA;

            // Call translate API
            const translatedText = await TranslateAPI.translateText(simulatedSourceText, sourceLang, targetLang);

            const newEntry = {
                id: Date.now().toString(),
                speaker: activePerson,
                sourceText: simulatedSourceText,
                translatedText: translatedText,
                sourceLang,
                targetLang,
            };

            setConversation(prev => [...prev, newEntry]);

            // Play TTS for the OTHER person
            const ttsLangMap = {
                'en': 'en-US', 'hi': 'hi-IN', 'bn': 'bn-IN', 'ta': 'ta-IN', 'te': 'te-IN',
                'mr': 'mr-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 'ml': 'ml-IN', 'pa': 'pa-IN',
                'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN', 'sa': 'sa-IN', 'mai': 'mai-IN',
                'sd': 'sd-IN', 'kok': 'kok-IN', 'doi': 'doi-IN', 'mni': 'mni-IN', 'sat': 'sat-IN',
                'kas': 'ks-IN', 'brx': 'brx-IN'
            };

            Speech.speak(translatedText, {
                language: ttsLangMap[targetLang] || 'en-US',
            });

        } catch (error) {
            console.error('Translation error', error);
        } finally {
            setIsTranslating(false);
            setActivePerson(null);
            setRecording(null);
        }
    };

    const handleMicPress = (person) => {
        if (isRecording && activePerson === person) {
            stopRecordingAndTranslate();
        } else if (!isRecording) {
            startRecording(person);
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Half: Person A (Blue) */}
            <View style={[styles.halfScreen, styles.personA]}>
                <View style={styles.header}>
                    <LanguagePicker
                        selectedLanguage={langA}
                        onSelectLanguage={setLangA}
                    />
                </View>
                <View style={styles.contentArea}>
                    {isTranslating && activePerson === 'A' ? (
                        <View style={styles.translatingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.translatingText}>Translating...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.micButton, isRecording && activePerson === 'A' && styles.micButtonActive]}
                            onPress={() => handleMicPress('A')}
                        >
                            <Ionicons name="mic" size={48} color={isRecording && activePerson === 'A' ? '#ff6b6b' : '#333'} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Center Log */}
            <View style={styles.logContainer}>
                <ScrollView contentContainerStyle={styles.logScroll}>
                    {conversation.map((msg) => (
                        <View key={msg.id} style={[styles.messageBubble, msg.speaker === 'A' ? styles.messageA : styles.messageB]}>
                            <Text style={styles.messageSource}>{msg.sourceText}</Text>
                            <Text style={styles.messageTranslation}>{msg.translatedText}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Bottom Half: Person B (Green) */}
            <View style={[styles.halfScreen, styles.personB]}>
                <View style={styles.contentArea}>
                    {isTranslating && activePerson === 'B' ? (
                        <View style={styles.translatingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.translatingText}>Translating...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.micButton, isRecording && activePerson === 'B' && styles.micButtonActive]}
                            onPress={() => handleMicPress('B')}
                        >
                            <Ionicons name="mic" size={48} color={isRecording && activePerson === 'B' ? '#ff6b6b' : '#333'} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.bottomHeader}>
                    <LanguagePicker
                        selectedLanguage={langB}
                        onSelectLanguage={setLangB}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
    },
    halfScreen: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    personA: {
        backgroundColor: '#4dabf7', // Blue
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    personB: {
        backgroundColor: '#69db7c', // Green
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 10,
    },
    bottomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 10,
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    micButtonActive: {
        backgroundColor: '#ffe3e3',
    },
    translatingContainer: {
        alignItems: 'center',
    },
    translatingText: {
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
    },
    logContainer: {
        height: 120,
        backgroundColor: '#f5f5f5',
        zIndex: 10,
        marginTop: -20,
        marginBottom: -20,
    },
    logScroll: {
        padding: 10,
        alignItems: 'center',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    messageA: {
        backgroundColor: '#e7f5ff',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    messageB: {
        backgroundColor: '#ebfbee',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    messageSource: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    messageTranslation: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});
