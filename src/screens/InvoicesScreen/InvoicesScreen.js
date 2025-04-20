import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, Searchbar, Button } from 'react-native-paper';
import { theme } from '../../constants/theme';

const InvoicesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search invoices"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <Button mode="contained" onPress={() => {}}>
          Create Invoice
        </Button>
      </View>
      
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Invoice #</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Customer</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {/* Sample row */}
        <DataTable.Row>
          <DataTable.Cell>INV-001</DataTable.Cell>
          <DataTable.Cell>2024-03-20</DataTable.Cell>
          <DataTable.Cell>John Doe</DataTable.Cell>
          <DataTable.Cell numeric>$150.00</DataTable.Cell>
          <DataTable.Cell>Paid</DataTable.Cell>
          <DataTable.Cell>
            <Button onPress={() => {}}>View</Button>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    marginRight: 16,
  },
});

export default InvoicesScreen;