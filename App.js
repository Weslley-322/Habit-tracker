import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeNotifications } from './src/services/notifications';
import { loadNotificationTime, hasStoredData } from './src/services/storage';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  // Inicializa o app
  const initializeApp = async () => {
    try {
      // Verifica se já existem dados salvos
      const hasData = await hasStoredData();

      // Se já tem dados, carrega configuração de notificações
      if (hasData) {
        const notificationTime = await loadNotificationTime();
        await initializeNotifications(notificationTime);
      }

      // Aguarda um pequeno delay para splash screen (opcional)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
    } finally {
      setIsReady(true);
    }
  };

  // Tela de loading enquanto inicializa
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Renderiza navegação principal
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  }
});