import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import styles from './styles';

const StatCard = ({ icon, value, label, color }) => (
  <Card style={styles.statsCard}>
    <Card.Content>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </Card.Content>
  </Card>
);

const QuickStats = () => {
  return (
    <View style={styles.statsContainer}>
      <StatCard 
        icon="cash-outline"
        value="$1,234"
        label="Today's Sales"
        color={theme.colors.success}
      />
      <StatCard 
        icon="cart-outline"
        value="28"
        label="Orders"
        color={theme.colors.warning}
      />
    </View>
  );
};

export default QuickStats;