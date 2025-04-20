import React from 'react';
import { ScrollView } from 'react-native';
import QuickStats from '../../components/dashboard/QuickStats/QuickStats';
import QuickActions from '../../components/dashboard/QuickActions/QuickActions';
import SalesChart from '../../components/dashboard/SalesChart/SalesChart';
import RecentActivity from '../../components/dashboard/RecentActivity/RecentActivity';
import LowStockAlert from '../../components/dashboard/LowStockAlert/LowStockAlert';
import { styles } from './styles';

const HomeContent = () => {
  return (
    <ScrollView style={styles.container}>
      <QuickStats />
      <QuickActions />
      <SalesChart />
      <RecentActivity />
      <LowStockAlert />
    </ScrollView>
  );
};

export default HomeContent;
