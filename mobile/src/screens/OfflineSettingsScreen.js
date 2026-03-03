import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCacheSize, clearCache } from '../services/offlineCache';
import LanguagePicker from '../components/LanguagePicker';

export default function OfflineSettingsScreen() {
    const [cacheSize, setCacheSize] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');

    useEffect(() => {
        getCacheSize().then(setCacheSize).catch(console.error);
    }, [refresh]);

    const handleClearCache = async () => {
        try {
            await clearCache();
            setRefresh(r => r + 1);
            Alert.alert('Cache Cleared', 'All offline translations have been removed.');
        } catch (e) {
            Alert.alert('Error', 'Failed to clear cache.');
        }
    };

    const handleDownloadPack = () => {
        // In a real app this would trigger phrasebook download/API calls to cache translations
        Alert.alert('Download Started', `Downloading offline translation pack for ${sourceLang} to ${targetLang}...`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="cloud-offline" size={50} color="#69db7c" />
                <Text style={styles.title}>Offline Translations</Text>
                <Text style={styles.subtitle}>
                    Save translations to your device to use BharatTranslate without an internet connection.
                </Text>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Storage Usage</Text>
                <Text style={styles.statsValue}>{cacheSize} Translations Cached</Text>
            </View>

            <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Download Language Pack</Text>
                <Text style={styles.actionDesc}>Pre-download common phrases and words.</Text>

                <View style={styles.langSelectors}>
                    <View style={{ flex: 1 }}><LanguagePicker selectedLanguage={sourceLang} onSelectLanguage={setSourceLang} /></View>
                    <Ionicons name="arrow-forward" size={24} color="#888" style={{ marginHorizontal: 10 }} />
                    <View style={{ flex: 1 }}><LanguagePicker selectedLanguage={targetLang} onSelectLanguage={setTargetLang} /></View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleDownloadPack}>
                    <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Download Pack</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={handleClearCache}>
                <Ionicons name="trash-outline" size={20} color="#ff6b6b" style={{ marginRight: 8 }} />
                <Text style={styles.clearButtonText}>Clear All Cached Translations</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
    statsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
        alignItems: 'center',
    },
    statsTitle: { fontSize: 16, color: '#888', marginBottom: 5 },
    statsValue: { fontSize: 24, fontWeight: 'bold', color: '#4dabf7' },
    actionCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
    },
    actionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    actionDesc: { fontSize: 14, color: '#666', marginBottom: 15 },
    langSelectors: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    button: {
        backgroundColor: '#4dabf7',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    clearButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff6b6b',
        backgroundColor: '#fff',
    },
    clearButtonText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
});
