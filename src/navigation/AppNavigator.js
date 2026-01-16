import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa as telas
import HomeScreen from '../screens/HomeScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Remove header padrão (usamos custom em cada tela)
          animation: 'slide_from_right', // Animação de transição
          contentStyle: { backgroundColor: '#F9FAFB' } // Background padrão
        }}
      >
        {/* Tela Principal */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Meus Hábitos'
          }}
        />

        {/* Adicionar Hábito */}
        <Stack.Screen 
          name="AddHabit" 
          component={AddHabitScreen}
          options={{
            title: 'Novo Hábito',
            animation: 'slide_from_bottom' 
          }}
        />

        {/* Progresso */}
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{
            title: 'Meu Progresso'
          }}
        />

        {/* Configurações */}
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Configurações'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}