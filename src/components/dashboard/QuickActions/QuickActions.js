import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import styles from './styles';

const QuickActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <Ionicons name={icon} size={32} color={theme.colors.primary} />
    <Text style={styles.quickActionText}>{label}</Text>
  </TouchableOpacity>
);

const QuickActions = () => {
  return (
    <View style={styles.quickActionsGrid}>
      <QuickActionButton icon="cart" label="New Sale" />
      <QuickActionButton icon="cube" label="Inventory" />
      <QuickActionButton icon="people" label="Customers" />
      <QuickActionButton icon="receipt" label="Transactions" />
    </View>
  );
};

export default QuickActions;