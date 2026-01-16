import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
export default function HabitCard ({ habit, onComplete, disabled }){
    const isComplete = habit.completedToday || false;
    const streak = habit.streak || 0;
    const hasStreakBonus = streak > 0 && streak % 5 === 0;
    
    return (
        <TouchableOpacity
          style={[styles.card, isCompleted && styles.cardCompleted]}
          onPress={() => !disabled && !isCompleted && onComplete(habit)}
          disabled={disabled || isComplete}
          activeOpacity={0.7}
        >
            <View style={style.info}>
                <Text style={[styles.name, isCompleted && styles.nameCompleted]}>
                    {habit.name}
                </Text>

                <View style={styles.streakContainer}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <Text style={styles.streakText}>{streak} dias</Text>

                    {hasStreakBonus && (
                        <View style={styles.bonusBadge}>
                            <Text style={styles.bonusBadgeText}>Bônus +5 XP</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[
                styles.checkButtom,
                isComplete && styles.checkButtomCompleted 
            ]}>
                <Text style={styles.checkIcon}>
                    {isCompleted ? 'a' : 'b'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
    },

    cardCompleted: {
        opacity: 0.7,
        backgroundColor: '#F3F4F6'
    },

    info: {
        flex: 1
    },

    name: {
        
    }



});