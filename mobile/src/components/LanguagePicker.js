import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export default function LanguagePicker({ selectedLang, onSelect }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.pickerText}>{selectedLang.name}</Text>
                <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Select Language</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.languageItem}
                                    onPress={() => {
                                        onSelect(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.languageText,
                                        selectedLang.code === item.code && styles.selectedText
                                    ]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    pickerText: {
        fontSize: 16,
        marginRight: 8,
        color: '#333'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%'
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    languageItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    languageText: {
        fontSize: 16,
        textAlign: 'center'
    },
    selectedText: {
        color: '#ff6b6b',
        fontWeight: 'bold'
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center'
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    }
});
