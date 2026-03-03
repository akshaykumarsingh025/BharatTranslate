import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy history data
const HISTORY_DATA = [
    { id: '1', source: 'Good morning', target: 'सुप्रभात', from: 'en', to: 'hi', favorite: true },
    { id: '2', source: 'Where is the train station?', target: 'Railway station kahan hai?', from: 'en', to: 'hi', favorite: false },
    { id: '3', source: 'namaste', target: 'नमस्ते', from: 'hi-rom', to: 'hi', favorite: true },
];

export default function HistoryScreen() {
    const [history, setHistory] = useState(HISTORY_DATA);

    const toggleFavorite = (id) => {
        setHistory(history.map(item =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
        ));
    };

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.itemContent}>
                <View style={styles.langRow}>
                    <Text style={styles.langText}>{item.from.toUpperCase()} → {item.to.toUpperCase()}</Text>
                </View>
                <Text style={styles.sourceText}>{item.source}</Text>
                <Text style={styles.targetText}>{item.target}</Text>
            </View>
            <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => toggleFavorite(item.id)}
            >
                <Ionicons
                    name={item.favorite ? "star" : "star-outline"}
                    size={24}
                    color={item.favorite ? "#ffd700" : "#ccc"}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History & Favorites</Text>
            </View>
            <FlatList
                data={history}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No translation history yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    listContainer: { padding: 16 },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 1
    },
    itemContent: { flex: 1 },
    langRow: { marginBottom: 4 },
    langText: { fontSize: 12, color: '#888', fontWeight: 'bold' },
    sourceText: { fontSize: 16, color: '#333', marginBottom: 4 },
    targetText: { fontSize: 18, color: '#444', fontWeight: '500' },
    favoriteBtn: { padding: 8, justifyContent: 'center' },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 }
});
