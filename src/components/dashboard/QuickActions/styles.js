import { StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

export default StyleSheet.create({
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 14,
  },
});