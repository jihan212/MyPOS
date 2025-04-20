import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Searchbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { theme } from '../../constants/theme';

const CustomersScreen = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search customers"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={customers}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>Phone: {item.phone}</Paragraph>
              <Paragraph>Email: {item.email}</Paragraph>
              <Paragraph>Total Orders: {item.totalOrders}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>View Details</Button>
              <Button onPress={() => {}}>Edit</Button>
            </Card.Actions>
          </Card>
        )}
        keyExtractor={item => item.id}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    margin: 16,
  },
  card: {
    margin: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default CustomersScreen;