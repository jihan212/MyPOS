import { StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

export default StyleSheet.create({
  recentActivityCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  activitySubtitle: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textLight,
  }
});