import { StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

export default StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    margin: 4,
    elevation: 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  }
});