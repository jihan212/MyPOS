import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOMERS_STORAGE_KEY = '@mypos_customers';

const AddEditCustomer = ({ route, navigation }) => {
	const editCustomer = route.params?.customer;
	const [name, setName] = useState(editCustomer?.name || '');
	const [email, setEmail] = useState(editCustomer?.email || '');
	const [phone, setPhone] = useState(editCustomer?.phone || '');
	const [address, setAddress] = useState(editCustomer?.address || '');
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		if (!name || !email || !phone) {
			alert('Please fill in all required fields');
			return;
		}

		try {
			setLoading(true);
			const customerData = {
				id: editCustomer?.id || Date.now().toString(),
				name,
				email,
				phone,
				address,
				totalPaidAmount: editCustomer?.totalPaidAmount || 0,
				totalOrders: editCustomer?.totalOrders || 0,
				updatedAt: new Date().toISOString(),
			};

			// Get existing customers
			const existingCustomersJson = await AsyncStorage.getItem(CUSTOMERS_STORAGE_KEY);
			let customers = existingCustomersJson ? JSON.parse(existingCustomersJson) : [];

			if (editCustomer) {
				// Update existing customer
				customers = customers.map(c => 
					c.id === editCustomer.id ? customerData : c
				);
			} else {
				// Add new customer
				customerData.createdAt = new Date().toISOString();
				customers.push(customerData);
			}

			// Save updated customers list
			await AsyncStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
			navigation.goBack();
		} catch (error) {
			console.error('Error saving customer:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Title style={styles.title}>
				{editCustomer ? 'Edit Customer' : 'Add New Customer'}
			</Title>

			<TextInput
				label='Customer Name'
				value={name}
				onChangeText={setName}
				style={styles.input}
			/>
			<TextInput
				label='Email'
				value={email}
				onChangeText={setEmail}
				keyboardType='email-address'
				style={styles.input}
			/>
			<TextInput
				label='Phone'
				value={phone}
				onChangeText={setPhone}
				keyboardType='phone-pad'
				style={styles.input}
			/>
			<TextInput
				label='Address'
				value={address}
				onChangeText={setAddress}
				multiline
				numberOfLines={3}
				style={styles.input}
			/>

			<Button
				mode='contained'
				onPress={handleSave}
				loading={loading}
				disabled={loading}
				style={styles.saveButton}
			>
				Save Customer
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		marginTop: 40,
		color: '#6200ee',
	},
	input: {
		marginBottom: 16,
	},
	saveButton: {
		marginTop: 16,
	},
});

export default AddEditCustomer;
