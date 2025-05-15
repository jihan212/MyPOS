import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

// Add RGB values for charts
if (!theme.colors.rgb) {
  // Default primary color in RGB format for charts
  theme.colors.rgb = {
    primary: '91, 104, 255',  // Assuming primary is #5B68FF
    accent: '255, 171, 64',   // Assuming accent is #FFAB40
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  welcomeHeader: {
    borderRadius: 16,
    marginBottom: 24,
    elevation: 3,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  welcomeHeaderContent: {
    padding: 20,
  },
  welcomeHeaderLeft: {
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 18,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  appNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.backdrop + '40',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.placeholder,
    marginLeft: 6,
  },
  timeText: {
    fontSize: 13,
    color: theme.colors.placeholder,
    marginLeft: 6,
  },
  // Stats Cards - Swipeable design
  statsCardsContainer: {
    marginBottom: 24,
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionBadge: {
    marginLeft: 8,
    backgroundColor: theme.colors.error,
    color: 'white',
    fontSize: 12,
  },
  statsCardsContent: {
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  statsCard: {
    height: 140,
    marginRight: 12,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsCardSubtitle: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 4,
  },
  statsCardIconContainer: {
    padding: 2,
  },
  statsCardIcon: {
    elevation: 2,
  },
  statsCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  // Chart Card
  chartCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  
  // Section Cards - New Design
  sectionCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  alertCard: {
    marginBottom: 24,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 0,
  },
  
  // Sale Items
  saleItemContainer: {
    paddingVertical: 12,
  },
  saleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleItemLeft: {
    marginRight: 12,
  },
  saleItemMiddle: {
    flex: 1,
  },
  saleItemCustomerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  saleItemDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  saleItemRight: {
    alignItems: 'flex-end',
  },
  saleItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  
  // Stock Items
  stockItemContainer: {
    paddingVertical: 12,
  },
  stockItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockItemLeft: {
    marginRight: 12,
  },
  stockItemMiddle: {
    flex: 1,
  },
  stockItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  stockItemCategory: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  stockItemRight: {
    alignItems: 'flex-end',
  },
  stockItemBadge: {
    backgroundColor: theme.colors.error,
    fontSize: 12,
  },
  
  // Common Elements
  itemDivider: {
    backgroundColor: theme.colors.backdrop + '30',
    height: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    fontStyle: 'italic',
    padding: 16,
  },
  
  // Retain other styles
  actionsCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  recentCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  alertCardHighlight: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  // Remove unused stat card styles
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recentSaleSurface: {
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    overflow: 'hidden',
  },
  recentSaleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  recentSaleInfo: {
    flex: 1,
  },
  recentSaleCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  saleItemsInfo: {
    marginTop: 4,
  },
  saleItemsText: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  lowStockSurface: {
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  lowStockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  lowStockName: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
  },
  stockBadge: {
    backgroundColor: theme.colors.error + '15',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  lowStockQuantity: {
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  cardLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginLeft: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  actionItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 6,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});