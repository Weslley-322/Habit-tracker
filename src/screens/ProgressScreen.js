import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loadUserProgress, loadHabitsLocal } from '../services/storage';
import { fetchDailyRecords } from '../services/api';
import { calculateLevel, getLevelProgress, GAME_CONSTANTS } from '../utils/gameLogic';
import { formatDateShort, getLastNDays } from '../utils/dateUtils';
import HabitMonthlyPanel from '../components/HabitMonthlyPanel';

export default function ProgressScreen({ navigation }) {
  const [userProgress, setUserProgress] = useState({ xp: 0, level: 1 });
  const [habits, setHabits] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeStreaks: 0,
    longestStreak: 0,
    completedToday: 0,
    completedThisWeek: 0,
    totalXP: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, []);

  // Carrega dados de progresso
  const loadProgressData = async () => {
    try {
      const progress = await loadUserProgress();
      const habitsData = await loadHabitsLocal();
      const records = await fetchDailyRecords();
       setDailyRecords(records || []);

      
      setUserProgress(progress);
      setHabits(habitsData);
      setDailyRecords(records || []);
      
      calculateStats(habitsData, progress);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  // Calcula estatísticas
  const calculateStats = (habitsData, progress) => {
    const totalHabits = habitsData.length;
    const activeStreaks = habitsData.filter(h => h.streak > 0).length;
    const longestStreak = Math.max(...habitsData.map(h => h.streak || 0), 0);
    const completedToday = habitsData.filter(h => h.completedToday).length;
    
    // Simula contagem da semana (em produção viria da API)
    const completedThisWeek = completedToday * 5; // Exemplo

    setStats({
      totalHabits,
      activeStreaks,
      longestStreak,
      completedToday,
      completedThisWeek,
      totalXP: progress.xp
    });
  };

  // Atualiza dados (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgressData();
    setRefreshing(false);
  };

  // Informações do nível atual
  const currentLevel = userProgress.level;
  const currentXP = userProgress.xp;
  const levelProgress = getLevelProgress(currentXP, currentLevel);
  const nextLevelXP = GAME_CONSTANTS.LEVEL_THRESHOLDS.find(
    t => t.level === currentLevel + 1
  )?.minXP;
  const isMaxLevel = currentLevel >= 5;

  // Top 3 hábitos com maior streak
  const topHabits = [...habits]
    .sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header com gradiente */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Progresso</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
      >
        {/* Card de Nível */}
        <View style={styles.levelCard}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{currentLevel}</Text>
          </View>
          
          <Text style={styles.levelTitle}>Nível {currentLevel}</Text>
          <Text style={styles.levelSubtitle}>
            {isMaxLevel 
              ? '🎉 Nível máximo alcançado!' 
              : `${currentXP} / ${nextLevelXP} XP`}
          </Text>

          {/* Barra de progresso do nível */}
          {!isMaxLevel && (
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View 
                  style={[styles.progressBarFill, { width: `${levelProgress}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(levelProgress)}% para o próximo nível
              </Text>
            </View>
          )}
        </View>

        {/* Grid de Estatísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Hábitos Criados</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.activeStreaks}</Text>
            <Text style={styles.statLabel}>Streaks Ativas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Maior Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{stats.completedToday}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>{stats.completedThisWeek}</Text>
            <Text style={styles.statLabel}>Esta Semana</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{stats.totalXP}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
        </View>

        {/* Top Hábitos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Top Hábitos</Text>
          
          {topHabits.length > 0 ? (
            topHabits.map((habit, index) => (
              <View key={habit.id} style={styles.topHabitCard}>
                <View style={styles.topHabitRank}>
                  <Text style={styles.topHabitRankText}>{index + 1}</Text>
                </View>
                <View style={styles.topHabitInfo}>
                  <Text style={styles.topHabitName}>{habit.name}</Text>
                  <View style={styles.topHabitStreak}>
                    <Text style={styles.fireIcon}>🔥</Text>
                    <Text style={styles.topHabitStreakText}>
                      {habit.streak || 0} dias consecutivos
                    </Text>
                  </View>
                </View>
                <View style={styles.topHabitBadge}>
                  <Text style={styles.topHabitBadgeText}>
                    {habit.streak * 10} XP
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>
                Comece a marcar seus hábitos para vê-los aqui!
              </Text>
            </View>
          )}
        </View>

         {/* 🆕 HISTÓRICO MENSAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Histórico Mensal</Text>

          {habits.length > 0 ? (
            habits.map(habit => (
              <HabitMonthlyPanel
                key={habit.id}
                habit={habit}
                dailyRecords={dailyRecords}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              Nenhum hábito encontrado.
            </Text>
          )}
        </View>

        {/* Sistema de XP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💎 Sistema de XP</Text>
          
          <View style={styles.xpInfoCard}>
            <View style={styles.xpInfoRow}>
              <Text style={styles.xpInfoIcon}>✓</Text>
              <View style={styles.xpInfoText}>
                <Text style={styles.xpInfoTitle}>Hábito Concluído</Text>
                <Text style={styles.xpInfoValue}>+10 XP</Text>
              </View>
            </View>

            <View style={styles.xpInfoDivider} />

            <View style={styles.xpInfoRow}>
              <Text style={styles.xpInfoIcon}>🔥</Text>
              <View style={styles.xpInfoText}>
                <Text style={styles.xpInfoTitle}>Bônus de Streak</Text>
                <Text style={styles.xpInfoValue}>+5 XP a cada 5 dias</Text>
              </View>
            </View>

            <View style={styles.xpInfoDivider} />

            <View style={styles.xpInfoRow}>
              <Text style={styles.xpInfoIcon}>⚡</Text>
              <View style={styles.xpInfoText}>
                <Text style={styles.xpInfoTitle}>Dica Pro</Text>
                <Text style={styles.xpInfoSubtext}>
                  Mantenha múltiplos hábitos com streaks altas para maximizar seu XP!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabela de Níveis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Tabela de Níveis</Text>
          
          {GAME_CONSTANTS.LEVEL_THRESHOLDS.map((threshold) => (
            <View 
              key={threshold.level}
              style={[
                styles.levelRow,
                threshold.level === currentLevel && styles.levelRowActive
              ]}
            >
              <View style={[
                styles.levelRowBadge,
                threshold.level === currentLevel && styles.levelRowBadgeActive,
                threshold.level < currentLevel && styles.levelRowBadgeCompleted
              ]}>
                <Text style={[
                  styles.levelRowNumber,
                  (threshold.level === currentLevel || threshold.level < currentLevel) && 
                  styles.levelRowNumberActive
                ]}>
                  {threshold.level}
                </Text>
              </View>
              
              <View style={styles.levelRowInfo}>
                <Text style={[
                  styles.levelRowTitle,
                  threshold.level === currentLevel && styles.levelRowTitleActive
                ]}>
                  Nível {threshold.level}
                </Text>
                <Text style={styles.levelRowXP}>
                  {threshold.minXP === 0 ? '0' : threshold.minXP}
                  {threshold.maxXP !== Infinity && ` - ${threshold.maxXP}`}
                  {threshold.maxXP === Infinity && '+'} XP
                </Text>
              </View>

              {threshold.level < currentLevel && (
                <Text style={styles.levelRowCheck}>✓</Text>
              )}
              {threshold.level === currentLevel && (
                <Text style={styles.levelRowCurrent}>Atual</Text>
              )}
            </View>
          ))}
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
    backgroundColor: '#8B5CF6'
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
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
  levelCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8
  },
  levelNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  levelSubtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 20
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center'
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
  topHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  topHabitRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  topHabitRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  topHabitInfo: {
    flex: 1
  },
  topHabitName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  topHabitStreak: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fireIcon: {
    fontSize: 14,
    marginRight: 4
  },
  topHabitStreakText: {
    fontSize: 13,
    color: '#6B7280'
  },
  topHabitBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  topHabitBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E'
  },
  xpInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  xpInfoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  xpInfoIcon: {
    fontSize: 28,
    marginRight: 16
  },
  xpInfoText: {
    flex: 1
  },
  xpInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2
  },
  xpInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6'
  },
  xpInfoSubtext: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18
  },
  xpInfoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  levelRowActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#8B5CF6'
  },
  levelRowBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  levelRowBadgeActive: {
    backgroundColor: '#8B5CF6'
  },
  levelRowBadgeCompleted: {
    backgroundColor: '#10B981'
  },
  levelRowNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280'
  },
  levelRowNumberActive: {
    color: '#FFFFFF'
  },
  levelRowInfo: {
    flex: 1
  },
  levelRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2
  },
  levelRowTitleActive: {
    color: '#111827',
    fontWeight: 'bold'
  },
  levelRowXP: {
    fontSize: 13,
    color: '#6B7280'
  },
  levelRowCheck: {
    fontSize: 20,
    color: '#10B981'
  },
  levelRowCurrent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  }
});