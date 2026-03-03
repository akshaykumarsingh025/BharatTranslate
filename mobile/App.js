import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import TextTranslateScreen from './src/screens/TextTranslateScreen';
import VoiceTranslateScreen from './src/screens/VoiceTranslateScreen';
import CameraTranslateScreen from './src/screens/CameraTranslateScreen';
import TransliterateScreen from './src/screens/TransliterateScreen';
import HistoryScreen from './src/screens/HistoryScreen';
// New Screens
import ConversationScreen from './src/screens/ConversationScreen';
import PhrasebookScreen from './src/screens/PhrasebookScreen';
import MoreScreen from './src/screens/MoreScreen';
import DocumentTranslateScreen from './src/screens/DocumentTranslateScreen';
import OfflineSettingsScreen from './src/screens/OfflineSettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MoreMain" component={MoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Voice" component={VoiceTranslateScreen} />
      <Stack.Screen name="Transliterate" component={TransliterateScreen} />
      <Stack.Screen name="Document" component={DocumentTranslateScreen} />
      <Stack.Screen name="Offline" component={OfflineSettingsScreen} options={{ title: 'Offline Settings' }} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Text') iconName = focused ? 'document-text' : 'document-text-outline';
              else if (route.name === 'Converse') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              else if (route.name === 'Camera') iconName = focused ? 'camera' : 'camera-outline';
              else if (route.name === 'Phrases') iconName = focused ? 'book' : 'book-outline';
              else if (route.name === 'More') iconName = focused ? 'menu' : 'menu-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#ff6b6b',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Text" component={TextTranslateScreen} />
          <Tab.Screen name="Converse" component={ConversationScreen} />
          <Tab.Screen name="Camera" component={CameraTranslateScreen} />
          <Tab.Screen name="Phrases" component={PhrasebookScreen} />
          <Tab.Screen name="More" component={MoreStack} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
