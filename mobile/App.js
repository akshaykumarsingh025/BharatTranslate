import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TextTranslateScreen from './src/screens/TextTranslateScreen';
import VoiceTranslateScreen from './src/screens/VoiceTranslateScreen';
import CameraTranslateScreen from './src/screens/CameraTranslateScreen';
import TransliterateScreen from './src/screens/TransliterateScreen';
import HistoryScreen from './src/screens/HistoryScreen';

import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

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
              else if (route.name === 'Voice') iconName = focused ? 'mic' : 'mic-outline';
              else if (route.name === 'Camera') iconName = focused ? 'camera' : 'camera-outline';
              else if (route.name === 'Transliterate') iconName = focused ? 'language' : 'language-outline';
              else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#ff6b6b',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Text" component={TextTranslateScreen} />
          <Tab.Screen name="Voice" component={VoiceTranslateScreen} />
          <Tab.Screen name="Camera" component={CameraTranslateScreen} />
          <Tab.Screen name="Transliterate" component={TransliterateScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
