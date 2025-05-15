import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Text, Divider, Surface, useTheme, ActivityIndicator } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { theme } from '../../constants/theme';
import { getData, STORAGE_KEYS } from '../../utils/dataStorage';

const ReportsScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const screenWidth = Dimensions.get('window').width - 32;

  useEffect(() => {
    loadSalesData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadSalesData().finally(() => setRefreshing(false));
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const sales = await getData(STORAGE_KEYS.SALES);
      setSalesData(Array.isArray(sales) ? sales : []);
    } catch (error) {
      console.error('Error loading sales data:', error);
      setError('Failed to load sales data');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    try {
      if (!Array.isArray(salesData) || salesData.length === 0) {
        return {
          labels: ['No Data'],
          datasets: [{ data: [0] }]
        };
      }

      // Sort sales by date
      const sortedSales = [...salesData].sort((a, b) => 
        new Date(a.date || 0) - new Date(b.date || 0)
      );
      
      // Get unique dates
      const uniqueDates = [...new Set(sortedSales.map(sale => 
        new Date(sale.date || new Date()).toISOString().split('T')[0]
      ))];

      // Get last 7 dates or all if less than 7
      const displayDates = uniqueDates.slice(-7);

      const dailySales = displayDates.map(date => {
        const daySales = sortedSales.filter(sale => 
          new Date(sale.date || 0).toISOString().split('T')[0] === date
        );
        return daySales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
      });

      return {
        labels: displayDates.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [{
          data: dailySales.length > 0 ? dailySales : [0]
        }]
      };
    } catch (error) {
      console.error('Error in getChartData:', error);
      return {
        labels: ['Error'],
        datasets: [{ data: [0] }]
      };
    }
  };

  const getTopProducts = () => {
    try {
      if (!Array.isArray(salesData) || salesData.length === 0) {
        return {
          labels: ['No Data'],
          datasets: [{ data: [0] }]
        };
      }

      const productSales = {};
      salesData.forEach(sale => {
        if (Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            if (item && item.name) {
              productSales[item.name] = (productSales[item.name] || 0) + (Number(item.quantity) || 0);
            }
          });
        }
      });

      const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4);

      if (sortedProducts.length === 0) {
        return {
          labels: ['No Products'],
          datasets: [{ data: [0] }]
        };
      }

      return {
        labels: sortedProducts.map(([name]) => name),
        datasets: [{
          data: sortedProducts.map(([,quantity]) => quantity)
        }]
      };
    } catch (error) {
      console.error('Error in getTopProducts:', error);
      return {
        labels: ['Error'],
        datasets: [{ data: [0] }]
      };
    }
  };

  const calculateTotalSales = () => {
    try {
      if (!Array.isArray(salesData)) return '0.00';
      return salesData.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0).toFixed(2);
    } catch (error) {
      console.error('Error in calculateTotalSales:', error);
      return '0.00';
    }
  };

  const calculateTotalOrders = () => {
    try {
      if (!Array.isArray(salesData)) return 0;
      return salesData.length;
    } catch (error) {
      console.error('Error in calculateTotalOrders:', error);
      return 0;
    }
  };

  const calculateAverageOrder = () => {
    try {
      if (!Array.isArray(salesData) || salesData.length === 0) return '0.00';
      const total = salesData.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
      return (total / salesData.length).toFixed(2);
    } catch (error) {
      console.error('Error in calculateAverageOrder:', error);
      return '0.00';
    }
  };

  const getRecentSales = () => {
    try {
      if (!Array.isArray(salesData)) return [];
      return [...salesData]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5);
    } catch (error) {
      console.error('Error in getRecentSales:', error);
      return [];
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Title style={styles.errorText}>{error}</Title>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Title>Sales Reports</Title>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Revenue Overview</Title>
          <LineChart
            data={getChartData()}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(91, 104, 255, ${opacity})`,
              labelColor: () => theme.colors.text,
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Top Selling Products</Title>
          <BarChart
            data={getTopProducts()}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(91, 104, 255, ${opacity})`,
              labelColor: () => theme.colors.text,
            }}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Summary</Title>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Paragraph>Total Sales</Paragraph>
              <Title>${calculateTotalSales()}</Title>
            </View>
            <View style={styles.summaryItem}>
              <Paragraph>Total Orders</Paragraph>
              <Title>{calculateTotalOrders()}</Title>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Paragraph>Average Order</Paragraph>
              <Title>${calculateAverageOrder()}</Title>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Sales</Title>
          <View style={styles.recentSalesContainer}>
            {getRecentSales().map((sale) => (
              <Surface key={sale.id || Math.random().toString()} style={styles.saleSurface}>
                <View style={styles.saleHeader}>
                  <View>
                    <Text style={styles.customerName}>{sale.customerName || 'N/A'}</Text>
                    <Text style={styles.saleDate}>
                      {sale.date ? new Date(sale.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </Text>
                  </View>
                  <Text style={styles.saleTotal}>
                    ${(Number(sale.total) || 0).toFixed(2)}
                  </Text>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.saleDetails}>
                  <View style={styles.saleInfo}>
                    <Text style={styles.saleLabel}>Items</Text>
                    <Text style={styles.saleValue}>
                      {Array.isArray(sale.items) 
                        ? sale.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
                        : 0}
                    </Text>
                  </View>
                  <View style={styles.saleInfo}>
                    <Text style={styles.saleLabel}>Products</Text>
                    <Text style={styles.saleValue}>
                      {Array.isArray(sale.items) ? sale.items.length : 0}
                    </Text>
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  recentSalesContainer: {
    gap: 12,
  },
  saleSurface: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  saleDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  saleTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: 8,
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  saleInfo: {
    alignItems: 'center',
  },
  saleLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  saleValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ReportsScreen;