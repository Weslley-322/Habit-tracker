import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configura como as notificações são exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

// Solicita permissão para enviar notificações
export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.log('Notificações só funcionam em dispositivos físicos');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Se não tem permissão, solicita
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permissão de notificação negada');
      return false;
    }

    // Configuração específica para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Lembretes de Hábitos',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B5CF6',
        sound: 'default'
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return false;
  }
};

// Agenda notificação diária
export const scheduleDailyNotification = async (time = '20:00') => {
  try {
    // Cancela notificações anteriores
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Extrai hora e minuto
    const [hours, minutes] = time.split(':').map(Number);

    // Mensagens motivacionais aleatórias
    const messages = [
      {
        title: '🎯 Hora dos seus hábitos!',
        body: 'Não esqueça de marcar suas atividades de hoje!'
      },
      {
        title: '🔥 Mantenha sua streak!',
        body: 'Mais um dia para fortalecer seus hábitos!'
      },
      {
        title: '⭐ Você consegue!',
        body: 'Pequenas ações diárias levam a grandes resultados!'
      },
      {
        title: '💪 Força e foco!',
        body: 'Seus hábitos estão esperando por você!'
      },
      {
        title: '🌟 Continue firme!',
        body: 'Cada dia marcado é uma vitória!'
      }
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Agenda notificação diária 
    // Calcula o próximo horário
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Se o horário já passou hoje, agenda para amanhã
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        ...(Platform.OS === 'android' && {
          channelId: 'habit-reminders'
        })
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
        repeats: true
      }
    });

    console.log('Notificação diária agendada:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
};

// Envia notificação imediata (para teste)
export const sendImmediateNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        ...(Platform.OS === 'android' && {
          channelId: 'habit-reminders'
        })
      },
      trigger: null // Envia imediatamente
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
};

// Envia notificação de conquista
export const sendAchievementNotification = async (achievement) => {
  const messages = {
    'streak_5': {
      title: '🔥 Streak de 5 dias!',
      body: 'Você ganhou +5 XP de bônus! Continue assim!'
    },
    'streak_10': {
      title: '🔥🔥 Incrível! 10 dias seguidos!',
      body: 'Sua dedicação é inspiradora!'
    },
    'level_up': {
      title: '⭐ Subiu de nível!',
      body: `Parabéns! Você alcançou o nível ${achievement.newLevel}!`
    },
    'all_habits_completed': {
      title: '🎉 Dia perfeito!',
      body: 'Todos os hábitos concluídos hoje!'
    }
  };

  const message = messages[achievement.type];
  if (message) {
    await sendImmediateNotification(message.title, message.body);
  }
};

// Cancela todas as notificações
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas as notificações foram canceladas');
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
  }
};

// Lista todas as notificações agendadas
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    return [];
  }
};

// Verifica se há notificações agendadas
export const hasScheduledNotifications = async () => {
  const notifications = await getScheduledNotifications();
  return notifications.length > 0;
};

// Listener para quando uma notificação é recebida
export const addNotificationReceivedListener = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

// Listener para quando usuário interage com a notificação
export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Remove listener
export const removeNotificationSubscription = (subscription) => {
  if (subscription) {
    subscription.remove();
  }
};

// Envia notificação de lembrete para hábitos não marcados
export const sendReminderForUncompletedHabits = async (uncompletedCount) => {
  if (uncompletedCount > 0) {
    await sendImmediateNotification(
      '⏰ Lembrete',
      `Você ainda tem ${uncompletedCount} ${
        uncompletedCount === 1 ? 'hábito' : 'hábitos'
      } para completar hoje!`
    );
  }
};

// Inicializa sistema de notificações
export const initializeNotifications = async (notificationTime = '20:00') => {
  const hasPermission = await requestNotificationPermissions();
  
  if (hasPermission) {
    await scheduleDailyNotification(notificationTime);
    return true;
  }
  
  return false;
};

// Atualiza horário da notificação diária
export const updateNotificationTime = async (newTime) => {
  try {
    await scheduleDailyNotification(newTime);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    return false;
  }
};