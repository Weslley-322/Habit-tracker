import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  initializeNotifications,
  updateNotificationTime,
  cancelAllNotifications,
  hasScheduledNotifications
} from '../services/notifications';
import {
  loadNotificationTime,
  saveNotificationTime,
  clearAllData
} from '../services/storage';
import { clearAPIData } from '../services/api';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('20:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  // Carrega configurações salvas
  const loadSettings = async () => {
    try {
      const savedTime = await loadNotificationTime();
      const hasNotifications = await hasScheduledNotifications();
      
      setNotificationTime(savedTime);
      setNotificationsEnabled(hasNotifications);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Alterna notificações on/off
  const toggleNotifications = async (value) => {
  // UI reage imediatamente
  setNotificationsEnabled(value);

  try {
    if (value) {
      const success = await initializeNotifications(notificationTime);

      if (!success) {
        setNotificationsEnabled(false);

        setTimeout(() => {
          Alert.alert(
            'Permissão Negada',
            'Ative as permissões nas configurações do dispositivo.'
          );
        }, 0);

      } else {
        setTimeout(() => {
          Alert.alert(
            '🔔 Notificações Ativadas',
            `Você receberá lembretes diários às ${notificationTime}`
          );
        }, 0);
      }

    } else {
      await cancelAllNotifications();

      setTimeout(() => {
        Alert.alert(
          '🔕 Notificações Desativadas',
          'Você não receberá mais lembretes'
        );
      }, 0);
    }

  } catch (error) {
    console.error('Erro ao alternar notificações:', error);
    setNotificationsEnabled(!value);

    setTimeout(() => {
      Alert.alert(
        'Erro',
        'Não foi possível alterar as notificações'
      );
    }, 0);
  }
};



  // Horários predefinidos
  const timeOptions = [
    { label: '8:00 - Manhã', value: '08:00' },
    { label: '12:00 - Meio-dia', value: '12:00' },
    { label: '18:00 - Tarde', value: '18:00' },
    { label: '20:00 - Noite', value: '20:00' },
    { label: '22:00 - Antes de dormir', value: '22:00' }
  ];

  // Altera horário da notificação
  const changeNotificationTime = async (newTime) => {
  try {
    setNotificationTime(newTime);
    await saveNotificationTime(newTime);

    if (notificationsEnabled) {
      await updateNotificationTime(newTime);

      setTimeout(() => {
        Alert.alert(
          '✅ Horário Atualizado',
          `Notificações agendadas para ${newTime}`
        );
      }, 0);
    }
  } catch (error) {
    console.error('Erro ao alterar horário:', error);

    setTimeout(() => {
      Alert.alert(
        'Erro',
        'Não foi possível alterar o horário'
      );
    }, 0);
  }
};

  // Reseta todos os dados
  const handleResetData = () => {
  Alert.alert(
    '⚠️ Resetar Dados',
    'Isso apagará TODOS os seus hábitos, progresso e configurações. Esta ação não pode ser desfeita!',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar Tudo',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearAllData();
            await clearAPIData();
            await cancelAllNotifications();

            setTimeout(() => {
              Alert.alert(
                '✅ Dados Apagados',
                'Todos os dados foram removidos com sucesso',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home')
                  }
                ]
              );
            }, 0);

          } catch (error) {
            console.error('Erro ao resetar dados:', error);

            setTimeout(() => {
              Alert.alert(
                'Erro',
                'Não foi possível apagar os dados'
              );
            }, 0);
          }
        }
      }
    ]
  );
};


  // Exibe informações do app
  const showAbout = () => {
  setTimeout(() => {
    Alert.alert(
      '📱 Sobre o App',
      'Diário de Hábitos v1.0\n\n' +
      'Um aplicativo para ajudar você a criar e manter hábitos diários através de gamificação.\n\n' +
      'Desenvolvido com React Native + Expo',
      [{ text: 'OK' }]
    );
  }, 0);
};


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Seção de Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notificações</Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Lembretes Diários</Text>
                <Text style={styles.settingDescription}>
                  Receba notificações para marcar seus hábitos
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                thumbColor={notificationsEnabled ? '#8B5CF6' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            {notificationsEnabled && (
              <>
                <View style={styles.divider} />
                
                <View style={styles.settingColumn}>
                  <Text style={styles.settingLabel}>Horário do Lembrete</Text>
                  <Text style={styles.settingDescription}>
                    Escolha quando deseja receber a notificação
                  </Text>

                  <View style={styles.timeOptions}>
                    {timeOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.timeOption,
                          notificationTime === option.value && styles.timeOptionActive
                        ]}
                        onPress={() => changeNotificationTime(option.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          notificationTime === option.value && styles.timeOptionTextActive
                        ]}>
                          {option.label}
                        </Text>
                        {notificationTime === option.value && (
                          <Text style={styles.timeOptionCheck}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Seção de Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Dados</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => navigation.navigate('Progress')}
              activeOpacity={0.7}
            >
              <Text style={styles.settingButtonIcon}>📊</Text>
              <View style={styles.settingButtonInfo}>
                <Text style={styles.settingButtonLabel}>Ver Progresso</Text>
                <Text style={styles.settingButtonDescription}>
                  Visualize suas estatísticas e conquistas
                </Text>
              </View>
              <Text style={styles.settingButtonArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingButton}
              onPress={handleResetData}
              activeOpacity={0.7}
            >
              <Text style={styles.settingButtonIcon}>🗑️</Text>
              <View style={styles.settingButtonInfo}>
                <Text style={[styles.settingButtonLabel, styles.dangerText]}>
                  Resetar Dados
                </Text>
                <Text style={styles.settingButtonDescription}>
                  Apaga todos os hábitos e progresso
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Sobre</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={showAbout}
              activeOpacity={0.7}
            >
              <Text style={styles.settingButtonIcon}>📱</Text>
              <View style={styles.settingButtonInfo}>
                <Text style={styles.settingButtonLabel}>Sobre o App</Text>
                <Text style={styles.settingButtonDescription}>
                  Versão, informações e créditos
                </Text>
              </View>
              <Text style={styles.settingButtonArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Versão</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info de Sistema */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Sistema de Gamificação</Text>
            <Text style={styles.infoText}>
              • Ganhe 10 XP por hábito concluído{'\n'}
              • Bônus de 5 XP a cada 5 dias de streak{'\n'}
              • Suba de nível acumulando XP{'\n'}
              • Máximo: Nível 5 (1000+ XP)
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 28,
    color: '#111827'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 40
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  settingColumn: {
    padding: 16
  },
  settingInfo: {
    flex: 1,
    marginRight: 12
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280'
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16
  },
  timeOptions: {
    marginTop: 12
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  timeOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#8B5CF6'
  },
  timeOptionText: {
    fontSize: 15,
    color: '#374151'
  },
  timeOptionTextActive: {
    color: '#8B5CF6',
    fontWeight: '600'
  },
  timeOptionCheck: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: 'bold'
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  settingButtonIcon: {
    fontSize: 28,
    marginRight: 12
  },
  settingButtonInfo: {
    flex: 1
  },
  settingButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  settingButtonDescription: {
    fontSize: 13,
    color: '#6B7280'
  },
  settingButtonArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    marginLeft: 8
  },
  dangerText: {
    color: '#DC2626'
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20
  }
});