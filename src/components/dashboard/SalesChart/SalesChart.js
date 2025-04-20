import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../../../constants/theme';
import styles from './styles';

const SalesChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      data: [1200, 1500, 1000, 1800, 2000, 1600]
    }]
  };

  return (
    <Card style={styles.chartCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Weekly Sales Summary</Text>
        <BarChart
          data={data}
          width={Dimensions.get('window').width - 50}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(91, 104, 255, ${opacity})`,
            labelColor: () => theme.colors.text,
            style: {
              borderRadius: 16
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default SalesChart;