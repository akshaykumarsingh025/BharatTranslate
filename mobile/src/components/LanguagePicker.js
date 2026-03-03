import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dialectMap from '../data/dialectMap.json';

const LANGUAGES = [
    // Original 10
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    // Additional 12
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'mni', name: 'Manipuri', native: 'মণিপুরী' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'kas', name: 'Kashmiri', native: 'کٲشُر' },
    { code: 'brx', name: 'Bodo', native: 'बड़ो' },
];

export default function LanguagePicker({ selectedLanguage, onSelectLanguage, selectedDialect, onSelectDialect }) {
    const [langModalVisible, setLangModalVisible] = useState(false);
    const [dialectModalVisible, setDialectModalVisible] = useState(false);

    // If using object from old way, extract code. If string, use string
    const langCode = typeof selectedLanguage === 'object' ? selectedLanguage.code : selectedLanguage;
    const langObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    const availableDialects = dialectMap[langCode];

    const handleSelectLanguage = (item) => {
        onSelectLanguage(item.code); // Pass string code backwards compatibility
        setLangModalVisible(false);
        if (onSelectDialect) {
            onSelectDialect('standard'); // Reset dialect
        }
    };

    const handleSelectDialect = (item) => {
        if (onSelectDialect) {
            onSelectDialect(item.id);
        }
        setDialectModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setLangModalVisible(true)}
            >
                <Text style={styles.pickerText}>{langObj.name}</Text>
                <Ionicons name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>

            {availableDialects && onSelectDialect && (
                <TouchableOpacity
                    style={[styles.pickerButton, styles.dialectButton]}
                    onPress={() => setDialectModalVisible(true)}
                >
                    <Text style={styles.dialectText}>
                        {availableDialects.find(d => d.id === selectedDialect)?.name || 'Standard'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#666" />
                </TouchableOpacity>
            )}

            {/* Language Modal */}
            <Modal visible={langModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Select Language</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => handleSelectLanguage(item)}
                                >
                                    <Text style={[
                                        styles.itemText,
                                        langCode === item.code && styles.selectedText
                                    ]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setLangModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Dialect Modal */}
            {availableDialects && (
                <Modal visible={dialectModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Select Dialect</Text>
                            <FlatList
                                data={availableDialects}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.itemRow}
                                        onPress={() => handleSelectDialect(item)}
                                    >
                                        <Text style={[
                                            styles.itemText,
                                            selectedDialect === item.id && styles.selectedText
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={() => setDialectModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center' },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 5,
    },
    pickerText: { fontSize: 16, marginRight: 5, color: '#333', fontWeight: '500' },
    dialectButton: { backgroundColor: '#f5f5f5', paddingVertical: 4, paddingHorizontal: 10, borderColor: '#eee' },
    dialectText: { fontSize: 12, marginRight: 3, color: '#666' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
    modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    itemRow: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemText: { fontSize: 16, textAlign: 'center', color: '#333' },
    selectedText: { color: '#ff6b6b', fontWeight: 'bold' },
    closeButton: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center' },
    closeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' }
});
