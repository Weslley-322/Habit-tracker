// Tabela de níveis com faixas de XP
export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 499 },
  { level: 4, minXP: 500, maxXP: 999 },
  { level: 5, minXP: 1000, maxXP: Infinity }
];

// Constantes de XP
export const XP_PER_HABIT = 10; // XP ganho por hábito concluído
export const XP_BONUS_STREAK = 5; // Bônus de XP a cada N dias de streak
export const STREAK_BONUS_INTERVAL = 5; // A cada quantos dias dá bônus

// Nível máximo do sistema
export const MAX_LEVEL = 5;

// Mensagens motivacionais para diferentes níveis
export const LEVEL_MESSAGES = {
  1: 'Iniciante - Comece sua jornada!',
  2: 'Aprendiz - Continue assim!',
  3: 'Dedicado - Você está evoluindo!',
  4: 'Experiente - Quase no topo!',
  5: 'Mestre - Nível máximo alcançado!'
};

// Cores por nível (para customização futura)
export const LEVEL_COLORS = {
  1: '#6B7280', // Cinza
  2: '#3B82F6', // Azul
  3: '#8B5CF6', // Roxo
  4: '#F59E0B', // Amarelo/Ouro
  5: '#EF4444'  // Vermelho/Épico
};

// Ícones por nível (emojis)
export const LEVEL_ICONS = {
  1: '🌱',
  2: '🌿',
  3: '🌳',
  4: '⭐',
  5: '👑'
};

// Função auxiliar: retorna configuração completa de um nível
export const getLevelConfig = (level) => {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  
  return {
    level,
    threshold: threshold || LEVEL_THRESHOLDS[0],
    message: LEVEL_MESSAGES[level] || 'Nível desconhecido',
    color: LEVEL_COLORS[level] || '#6B7280',
    icon: LEVEL_ICONS[level] || '❓'
  };
};

// Função auxiliar: retorna XP total necessário para um nível
export const getTotalXPForLevel = (level) => {
  const threshold = LEVEL_THRESHOLDS.find(t => t.level === level);
  return threshold ? threshold.minXP : 0;
};