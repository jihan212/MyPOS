import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Searchbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const CustomersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Demo customer data
  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      totalOrders: 5
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      address: '456 Oak Ave, Town',
      totalOrders: 3
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1122334455',
      address: '789 Pine Rd, Village',
      totalOrders: 8
    }
  ]);

  const handleDelete = (customerId) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  const renderCustomer = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Phone: {item.phone}</Paragraph>
        <Paragraph>Address: {item.address}</Paragraph>
        <Paragraph>Total Orders: {item.totalOrders}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('EditCustomer', { customer: item })}>Edit</Button>
        <Button onPress={() => handleDelete(item.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search customers"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={customers.filter(customer => 
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddCustomer')}
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
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  }
});

export default CustomersScreen;