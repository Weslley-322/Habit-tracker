import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves do AsyncStorage
const KEYS = {
  HABITS: '@habits',
  USER_PROGRESS: '@user_progress',
  LAST_SYNC: '@last_sync',
  NOTIFICATION_TIME: '@notification_time'
};

// === HÁBITOS ===

// Salva lista de hábitos localmente
export const saveHabitsLocal = async (habits) => {
  try {
    const cleanedHabits = habits.map(({ completedToday, ...rest }) => rest);
    await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(cleanedHabits));
    return true;
  } catch (error) {
    console.error('Erro ao salvar hábitos:', error);
    return false;
  }
};

// Carrega hábitos do storage local
export const loadHabitsLocal = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.HABITS);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar hábitos:', error);
    return [];
  }
};


// === PROGRESSO DO USUÁRIO ===

// Salva progresso do usuário (XP e nível)
export const saveUserProgress = async (progress) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return false;
  }
};

// Carrega progresso do usuário
export const loadUserProgress = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    return jsonValue ? JSON.parse(jsonValue) : { xp: 0, level: 1 };
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return { xp: 0, level: 1 };
  }
};

// === SINCRONIZAÇÃO ===

// Salva timestamp da última sincronização com a API
export const saveLastSync = async () => {
  try {
    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem(KEYS.LAST_SYNC, timestamp);
    return true;
  } catch (error) {
    console.error('Erro ao salvar última sync:', error);
    return false;
  }
};

// Carrega timestamp da última sincronização
export const loadLastSync = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(KEYS.LAST_SYNC);
    return timestamp;
  } catch (error) {
    console.error('Erro ao carregar última sync:', error);
    return null;
  }
};

// === CONFIGURAÇÕES DE NOTIFICAÇÃO ===

// Salva horário preferido para notificação
export const saveNotificationTime = async (time) => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATION_TIME, time);
    return true;
  } catch (error) {
    console.error('Erro ao salvar horário de notificação:', error);
    return false;
  }
};

// Carrega horário de notificação
export const loadNotificationTime = async () => {
  try {
    const time = await AsyncStorage.getItem(KEYS.NOTIFICATION_TIME);
    return time || '20:00'; // Padrão: 20h
  } catch (error) {
    console.error('Erro ao carregar horário de notificação:', error);
    return '20:00';
  }
};

// === UTILIDADES ===

// Limpa todos os dados locais (para reset/debug)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.HABITS,
      KEYS.USER_PROGRESS,
      KEYS.LAST_SYNC,
      KEYS.NOTIFICATION_TIME
    ]);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

// Verifica se existem dados salvos
export const hasStoredData = async () => {
  try {
    const habits = await AsyncStorage.getItem(KEYS.HABITS);
    return habits !== null;
  } catch (error) {
    console.error('Erro ao verificar dados:', error);
    return false;
  }
};