// Configuração dos níveis (XP necessário)
const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 499 },
  { level: 4, minXP: 500, maxXP: 999 },
  { level: 5, minXP: 1000, maxXP: Infinity }
];

// Constantes de XP
const XP_PER_HABIT = 10;
const XP_BONUS_STREAK = 5;
const STREAK_BONUS_INTERVAL = 5;

// Calcula o nível baseado no XP acumulado
export const calculateLevel = (xp) => {
  const level = LEVEL_THRESHOLDS.find(
    threshold => xp >= threshold.minXP && xp <= threshold.maxXP
  );
  return level ? level.level : 1;
};

// Calcula o XP ganho ao completar um hábito
export const calculateXPGain = (currentStreak) => {
  const baseXP = XP_PER_HABIT;
  const newStreak = currentStreak + 1;
  
  // Bônus a cada 5 dias de streak
  const bonusXP = newStreak % STREAK_BONUS_INTERVAL === 0 ? XP_BONUS_STREAK : 0;
  
  return {
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    newStreak
  };
};

// Retorna o XP necessário para o próximo nível
export const getXPForNextLevel = (currentLevel) => {
  if (currentLevel >= 5) return null; // Nível máximo atingido
  
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextLevel ? nextLevel.minXP : null;
};

// Calcula a porcentagem de progresso para o próximo nível
export const getLevelProgress = (xp, currentLevel) => {
  if (currentLevel >= 5) return 100; // Nível máximo
  
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  
  if (!currentThreshold || !nextThreshold) return 0;
  
  const xpInCurrentLevel = xp - currentThreshold.minXP;
  const xpNeededForNextLevel = nextThreshold.minXP - currentThreshold.minXP;
  
  return Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
};

// Verifica se duas datas são do mesmo dia
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Verifica se pode marcar o hábito (apenas no dia atual)
export const canCompleteHabit = (lastCompletedDate) => {
  if (!lastCompletedDate) return true; // Nunca foi marcado
  
  const today = new Date();
  const lastCompleted = new Date(lastCompletedDate);
  
  // Só pode marcar se não foi marcado hoje
  return !isSameDay(today, lastCompleted);
};

// Verifica se a streak deve ser resetada
export const shouldResetStreak = (lastCompletedDate) => {
  if (!lastCompletedDate) return false; // Nunca foi marcado, não precisa resetar
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera horas para comparação de dias
  
  const lastCompleted = new Date(lastCompletedDate);
  lastCompleted.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Calcula diferença em dias
  const diffTime = today.getTime() - lastCompleted.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 2;
};

// Exporta constantes para uso em outros arquivos
export const GAME_CONSTANTS = {
  XP_PER_HABIT,
  XP_BONUS_STREAK,
  STREAK_BONUS_INTERVAL,
  LEVEL_THRESHOLDS
};