import { StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

export default StyleSheet.create({
  alertCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
    color: theme.colors.warning,
    fontWeight: '500',
  }
});