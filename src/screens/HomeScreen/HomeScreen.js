import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, RefreshControl, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Text, IconButton, ActivityIndicator, Surface, Avatar, Badge, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getData, STORAGE_KEYS } from '../../utils/dataStorage';
import { styles } from './styles';
import { theme } from '../../constants/theme';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 40;
const cardWidth = screenWidth * 0.7;

// Default chart data to prevent null errors
const defaultChartData = {
  labels: ['No Data'],
  datasets: [{ data: [0] }]
};

const HomeContent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentSales: [],
    lowStockProducts: [],
    salesByDay: defaultChartData,
    topProducts: defaultChartData
  });

  // Update time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Format date and time strings
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Define stats cards data
  const statsCards = [
    {
      id: 'sales',
      title: 'Total Sales',
      subtitle: 'Revenue',
      value: dashboardData.totalSales.toFixed(2),
      icon: 'cash',
      backgroundColor: '#d7f5e8', // Light green
      textColor: '#008055'
    },
    {
      id: 'products',
      title: 'Products',
      subtitle: 'Inventory',
      value: dashboardData.totalProducts,
      icon: 'cube',
      backgroundColor: '#e2dffe', // Light purple
      textColor: '#6956e5'
    },
    {
      id: 'customers',
      title: 'Customers',
      subtitle: 'Active accounts',
      value: dashboardData.totalCustomers,
      icon: 'account',
      backgroundColor: '#fff3d0', // Light yellow
      textColor: '#e6ac00'
    },
    {
      id: 'orders',
      title: 'Recent Orders',
      subtitle: 'Last 7 days',
      value: dashboardData.recentSales.length,
      icon: 'receipt',
      backgroundColor: '#ffe2e6', // Light pink
      textColor: '#dd3057'
    }
  ];

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const [sales, products, customers] = await Promise.all([
        getData(STORAGE_KEYS.SALES),
        getData(STORAGE_KEYS.PRODUCTS),
        getData(STORAGE_KEYS.CUSTOMERS)
      ]);

      const totalSales = Array.isArray(sales) 
        ? sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0)
        : 0;

      const lowStockProducts = Array.isArray(products)
        ? products.filter(product => (Number(product.stock) || 0) < 10)
        : [];

      // Process data for sales chart
      const salesByDay = processSalesDataByDay(sales);
      
      // Process data for top products chart
      const topProducts = processTopProductsData(sales);

      setDashboardData({
        totalSales,
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalCustomers: Array.isArray(customers) ? customers.length : 0,
        recentSales: Array.isArray(sales) 
          ? sales.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5)
          : [],
        lowStockProducts,
        salesByDay,
        topProducts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default chart data in case of error
      setDashboardData(prevState => ({
        ...prevState,
        salesByDay: defaultChartData,
        topProducts: defaultChartData
      }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Process sales data to get daily totals for chart
  const processSalesDataByDay = (sales) => {
    if (!Array.isArray(sales) || sales.length === 0) {
      return defaultChartData;
    }

    try {
      // Group sales by date and calculate totals
      const salesByDate = {};
      sales.forEach(sale => {
        if (sale.date) {
          const dateStr = new Date(sale.date).toISOString().split('T')[0];
          salesByDate[dateStr] = (salesByDate[dateStr] || 0) + (Number(sale.total) || 0);
        }
      });

      // Get the last 7 days with sales
      const dates = Object.keys(salesByDate).sort().slice(-7);
      
      // If no dates found, return default
      if (dates.length === 0) {
        return defaultChartData;
      }
      
      const values = dates.map(date => salesByDate[date]);

      return {
        labels: dates.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        }),
        datasets: [{ data: values }]
      };
    } catch (error) {
      console.error('Error processing sales data for chart:', error);
      return defaultChartData;
    }
  };

  // Process sales data to find top selling products
  const processTopProductsData = (sales) => {
    if (!Array.isArray(sales) || sales.length === 0) {
      return defaultChartData;
    }

    try {
      // Count quantities sold for each product
      const productQuantities = {};
      sales.forEach(sale => {
        if (Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            if (item && item.name) {
              productQuantities[item.name] = (productQuantities[item.name] || 0) + (Number(item.quantity) || 0);
            }
          });
        }
      });

      // If no products found, return default
      if (Object.keys(productQuantities).length === 0) {
        return defaultChartData;
      }

      // Get the top 5 products by quantity
      const topProducts = Object.entries(productQuantities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      return {
        labels: topProducts.map(([name]) => name.length > 10 ? name.substring(0, 10) + '...' : name),
        datasets: [{ data: topProducts.map(([, qty]) => qty) }]
      };
    } catch (error) {
      console.error('Error processing product data for chart:', error);
      return defaultChartData;
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = React.useCallback(() => {
    loadDashboardData();
  }, []);

  const renderStatCard = ({ item }) => (
    <View style={[styles.statsCard, { backgroundColor: item.backgroundColor, width: cardWidth }]}>
      <View style={styles.statsCardHeader}>
        <View>
          <Text style={[styles.statsCardTitle, { color: item.textColor }]}>{item.title}</Text>
          <Text style={styles.statsCardSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.statsCardIconContainer}>
          <Avatar.Icon 
            size={40} 
            icon={item.icon} 
            style={[styles.statsCardIcon, { backgroundColor: 'white' }]} 
            color={item.textColor}
          />
        </View>
      </View>
      <Text style={[styles.statsCardValue, { color: item.textColor }]}>
        {item.id === 'sales' ? '$' : ''}{item.value}
      </Text>
    </View>
  );

  const renderRecentSale = ({ item }) => (
    <View style={styles.saleItemContainer}>
      <View style={styles.saleItemContent}>
        <View style={styles.saleItemLeft}>
          <Avatar.Text 
            size={40} 
            label={item.customerName ? item.customerName.substring(0, 2).toUpperCase() : 'NA'} 
            style={{ backgroundColor: theme.colors.primary + '30' }} 
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.saleItemMiddle}>
          <Text style={styles.saleItemCustomerName}>{item.customerName || 'Walk-in Customer'}</Text>
          <Text style={styles.saleItemDate}>
            {item.date ? new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'N/A'}
          </Text>
        </View>
        <View style={styles.saleItemRight}>
          <Text style={styles.saleItemAmount}>${Number(item.total || 0).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const renderLowStockItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.stockItemContainer}
      onPress={() => navigation.navigate('EditProduct', { product: item })}
    >
      <View style={styles.stockItemContent}>
        <View style={styles.stockItemLeft}>
          <Avatar.Icon 
            size={40}
            icon="cube"
            style={{ backgroundColor: theme.colors.error + '20' }}
            color={theme.colors.error}
          />
        </View>
        <View style={styles.stockItemMiddle}>
          <Text style={styles.stockItemName}>{item.name}</Text>
          <Text style={styles.stockItemCategory}>{item.category || 'Uncategorized'}</Text>
        </View>
        <View style={styles.stockItemRight}>
          <Badge style={styles.stockItemBadge}>{item.stock} left</Badge>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(${theme.colors.rgb.primary || '91, 104, 255'}, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.colors.primary
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Redesigned Welcome Header */}
      <Surface style={styles.welcomeHeader}>
        <View style={styles.welcomeHeaderContent}>
          <View style={styles.welcomeHeaderLeft}>
            <Text style={styles.greetingText}>
              {currentTime.getHours() < 12 
                ? 'Good Morning' 
                : currentTime.getHours() < 18 
                  ? 'Good Afternoon' 
                  : 'Good Evening'}
            </Text>
            <Text style={styles.appNameText}>My POS System</Text>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="calendar" size={14} color={theme.colors.placeholder} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.placeholder} />
              <Text style={styles.timeText}>{formattedTime}</Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* Stats Cards - Swipeable */}
      <View style={styles.statsCardsContainer}>
        <View style={styles.sectionHeaderWithIcon}>
          <Title style={styles.sectionTitle}>Overview</Title>
          <IconButton
            icon="information"
            size={20}
            iconColor={theme.colors.placeholder}
            onPress={() => {}}
          />
        </View>
        <FlatList
          data={statsCards}
          renderItem={renderStatCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsCardsContent}
          snapToInterval={cardWidth + 12}
          snapToAlignment="start"
          decelerationRate="fast"
          initialNumToRender={2}
        />
      </View>

      {/* Sales Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Sales Trend</Title>
            <IconButton
              icon="arrow-right"
              size={20}
              onPress={() => navigation.navigate('Reports')}
              iconColor={theme.colors.primary}
            />
          </View>
          
          {dashboardData.salesByDay && (
            <LineChart
              data={dashboardData.salesByDay}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card.Content>
      </Card>
      
      {/* Top Products Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Top Selling Products</Title>
            <IconButton
              icon="arrow-right"
              size={20}
              onPress={() => navigation.navigate('Products')}
              iconColor={theme.colors.primary}
            />
          </View>
          
          {dashboardData.topProducts && (
            <BarChart
              data={dashboardData.topProducts}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={30}
            />
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.quickActionsContainer}>
            <View style={styles.actionItem}>
              <IconButton
                icon="cart-outline"
                mode="contained"
                size={28}
                onPress={() => navigation.navigate('Sales')}
                containerColor={theme.colors.primary}
                iconColor="white"
              />
              <Text style={styles.actionLabel}>New Sale</Text>
            </View>
            
            <View style={styles.actionItem}>
              <IconButton
                icon="cube-outline"
                mode="contained"
                size={28}
                onPress={() => navigation.navigate('Products')}
                containerColor={theme.colors.primary}
                iconColor="white"
              />
              <Text style={styles.actionLabel}>Products</Text>
            </View>
            
            <View style={styles.actionItem}>
              <IconButton
                icon="account-outline"
                mode="contained"
                size={28}
                onPress={() => navigation.navigate('Customers')}
                containerColor={theme.colors.primary}
                iconColor="white"
              />
              <Text style={styles.actionLabel}>Customers</Text>
            </View>
            
            <View style={styles.actionItem}>
              <IconButton
                icon="file-document-outline"
                mode="contained"
                size={28}
                onPress={() => navigation.navigate('Invoices')}
                containerColor={theme.colors.primary}
                iconColor="white"
              />
              <Text style={styles.actionLabel}>Invoices</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Sales Section - Redesigned */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Sales</Title>
            <IconButton
              icon="receipt"
              size={20}
              onPress={() => navigation.navigate('Invoices')}
              iconColor={theme.colors.primary}
            />
          </View>
          
          {dashboardData.recentSales.length > 0 ? (
            <View>
              {dashboardData.recentSales.map((sale) => (
                <React.Fragment key={sale.id || Math.random().toString()}>
                  {renderRecentSale({ item: sale })}
                  {dashboardData.recentSales.indexOf(sale) < dashboardData.recentSales.length - 1 && (
                    <Divider style={styles.itemDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No recent sales</Text>
          )}
        </Card.Content>
      </Card>

      {/* Low Stock Section - Redesigned */}
      {dashboardData.lowStockProducts.length > 0 && (
        <Card style={[styles.alertCard, { marginBottom: 32 }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.alertTitleContainer}>
                <Title style={styles.sectionTitle}>Low Stock Alert</Title>
                <Badge style={styles.sectionBadge}>{dashboardData.lowStockProducts.length}</Badge>
              </View>
              <IconButton
                icon="cube"
                size={20}
                onPress={() => navigation.navigate('Products')}
                iconColor={theme.colors.primary}
              />
            </View>
            
            <View>
              {dashboardData.lowStockProducts.map((product) => (
                <React.Fragment key={product.id || Math.random().toString()}>
                  {renderLowStockItem({ item: product })}
                  {dashboardData.lowStockProducts.indexOf(product) < dashboardData.lowStockProducts.length - 1 && (
                    <Divider style={styles.itemDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

export default HomeContent;
