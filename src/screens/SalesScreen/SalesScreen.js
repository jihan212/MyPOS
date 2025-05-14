import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
	TextInput,
	Button,
	Card,
	Title,
	Paragraph,
	Searchbar,
} from 'react-native-paper';
import { theme } from '../../constants/theme';

const SalesScreen = () => {
	const [cart, setCart] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	const calculateTotal = () => {
		return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	};

	return (
		<View style={styles.container}>
			<View style={styles.leftPanel}>
				<Searchbar
					placeholder='Search products'
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={styles.searchBar}
				/>
				<FlatList
					data={[]} // Product list will go here
					renderItem={({ item }) => (
						<Card style={styles.productCard}>
							<Card.Content>
								<Title>{item.name}</Title>
								<Paragraph>${item.price}</Paragraph>
							</Card.Content>
							<Card.Actions>
								<Button onPress={() => {}}>Add to Cart</Button>
							</Card.Actions>
						</Card>
					)}
				/>
			</View>
			<View style={styles.rightPanel}>
				<Title>Current Cart</Title>
				<FlatList
					data={cart}
					renderItem={({ item }) => (
						<Card style={styles.cartItem}>
							<Card.Content>
								<Title>{item.name}</Title>
								<Paragraph>Quantity: {item.quantity}</Paragraph>
								<Paragraph>
									${item.price * item.quantity}
								</Paragraph>
							</Card.Content>
						</Card>
					)}
				/>
				<View style={styles.totalSection}>
					<Title>Total: ${calculateTotal()}</Title>
					<Button
						mode='contained'
						onPress={() => {}}
					>
						Complete Sale
					</Button>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: theme.colors.background,
	},
	leftPanel: {
		flex: 2,
		padding: 8,
		borderRightWidth: 1,
		borderRightColor: theme.colors.border,
	},
	rightPanel: {
		flex: 1,
		padding: 8,
	},
	searchBar: {
		marginBottom: 8,
	},
	productCard: {
		marginBottom: 8,
	},
	cartItem: {
		marginBottom: 8,
	},
	totalSection: {
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: theme.colors.border,
	},
});

export default SalesScreen;
