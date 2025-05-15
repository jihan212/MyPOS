import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
	FAB,
	Searchbar,
	Card,
	Title,
	Paragraph,
	Button,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../constants/theme';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const CUSTOMERS_STORAGE_KEY = '@mypos_customers';

const CustomersScreen = () => {
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = useState('');
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(false);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			loadCustomers();
		}
	}, [isFocused]);

	const loadCustomers = async () => {
		try {
			setLoading(true);
			const storedCustomers = await AsyncStorage.getItem(CUSTOMERS_STORAGE_KEY);
			if (storedCustomers) {
				setCustomers(JSON.parse(storedCustomers));
			}
		} catch (error) {
			console.error('Error loading customers:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (customerId) => {
		try {
			const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
			await AsyncStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers));
			setCustomers(updatedCustomers);
		} catch (error) {
			console.error('Error deleting customer:', error);
		}
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
				<Button
					onPress={() =>
						navigation.navigate('EditCustomer', { customer: item })
					}
				>
					Edit
				</Button>
				<Button onPress={() => handleDelete(item.id)}>Delete</Button>
			</Card.Actions>
		</Card>
	);

	return (
		<View style={styles.container}>
			<Searchbar
				placeholder='Search customers'
				onChangeText={setSearchQuery}
				value={searchQuery}
				style={styles.searchBar}
			/>
			<FlatList
				data={customers.filter(
					(customer) =>
						customer.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						customer.email
							.toLowerCase()
							.includes(searchQuery.toLowerCase())
				)}
				renderItem={renderCustomer}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
			/>
			<FAB
				style={styles.fab}
				icon='plus'
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
	},
});

export default CustomersScreen;
