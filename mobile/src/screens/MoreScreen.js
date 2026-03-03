import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MENU_ITEMS = [
    { id: 'Voice', title: 'Voice Translation', icon: 'mic' },
    { id: 'Transliterate', title: 'Transliteration', icon: 'language' },
    { id: 'Document', title: 'Document Translate', icon: 'document' },
    { id: 'Offline', title: 'Offline Settings', icon: 'cloud-offline' },
    { id: 'History', title: 'History', icon: 'time' },
];

export default function MoreScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>More Features</Text>

            <FlatList
                data={MENU_ITEMS}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate(item.id)}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name={item.icon} size={32} color="#ff6b6b" />
                        </View>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    grid: {
        paddingBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        minHeight: 120,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
});
