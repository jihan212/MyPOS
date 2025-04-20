import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import styles from './styles';

const LowStockAlert = () => {
  return (
    <Card style={[styles.alertCard, { backgroundColor: theme.colors.warning + '20' }]}>
      <Card.Content style={styles.alertContent}>
        <Ionicons name="warning-outline" size={24} color={theme.colors.warning} />
        <Text style={styles.alertText}>3 items are running low on stock</Text>
        <Button 
          mode="text" 
          textColor={theme.colors.warning}
          onPress={() => {}}>
          View
        </Button>
      </Card.Content>
    </Card>
  );
};

export default LowStockAlert;