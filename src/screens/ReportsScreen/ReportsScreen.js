import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Menu, Divider } from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { theme } from '../../constants/theme';

const ReportsScreen = () => {
  const [timeRange, setTimeRange] = useState('This Week');
  const [menuVisible, setMenuVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width - 32;

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2500, 3000, 2800, 3500, 2900, 3800, 3200]
    }]
  };

  const productData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [{
      data: [20, 45, 28, 35]
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Sales Reports</Title>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {timeRange}
            </Button>
          }
        >
          <Menu.Item onPress={() => {
            setTimeRange('Today');
            setMenuVisible(false);
          }} title="Today" />
          <Menu.Item onPress={() => {
            setTimeRange('This Week');
            setMenuVisible(false);
          }} title="This Week" />
          <Menu.Item onPress={() => {
            setTimeRange('This Month');
            setMenuVisible(false);
          }} title="This Month" />
        </Menu>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Revenue Overview</Title>
          <LineChart
            data={salesData}
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
            data={productData}
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
              <Title>$21,800</Title>
            </View>
            <View style={styles.summaryItem}>
              <Paragraph>Total Orders</Paragraph>
              <Title>156</Title>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Paragraph>Average Order</Paragraph>
              <Title>$139.74</Title>
            </View>
            <View style={styles.summaryItem}>
              <Paragraph>Profit Margin</Paragraph>
              <Title>32%</Title>
            </View>
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
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ReportsScreen;