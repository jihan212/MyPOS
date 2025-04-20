import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import styles from './styles';

const RecentActivity = () => {
  return (
    <Card style={styles.recentActivityCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.activityItem}>
            <Ionicons name="time-outline" size={20} color={theme.colors.textLight} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Sale #1234</Text>
              <Text style={styles.activitySubtitle}>$123.45 - 2 items</Text>
            </View>
            <Text style={styles.activityTime}>2m ago</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;