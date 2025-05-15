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

const PRODUCTS_STORAGE_KEY = '@mypos_products';

const ProductsScreen = () => {
	const [products, setProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			loadProducts();
		}
	}, [isFocused]);

	const loadProducts = async () => {
		try {
			setLoading(true);
			const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
			if (storedProducts) {
				setProducts(JSON.parse(storedProducts));
			}
		} catch (error) {
			console.error('Error loading products:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (productId) => {
		try {
			const updatedProducts = products.filter((product) => product.id !== productId);
			await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
			setProducts(updatedProducts);
		} catch (error) {
			console.error('Error deleting product:', error);
		}
	};

	const renderProduct = ({ item }) => (
		<Card style={styles.card}>
			{item.imageUrl && (
				<Card.Cover
					source={{ uri: item.imageUrl }}
					style={styles.productImage}
				/>
			)}
			<Card.Content>
				<Title>{item.name}</Title>
				<Paragraph>Price: ${item.price}</Paragraph>
				<Paragraph>Stock: {item.stock}</Paragraph>
				<Paragraph>Category: {item.category}</Paragraph>
			</Card.Content>
			<Card.Actions>
				<Button
					onPress={() =>
						navigation.navigate('EditProduct', { product: item })
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
				placeholder='Search products'
				onChangeText={setSearchQuery}
				value={searchQuery}
				style={styles.searchBar}
			/>
			<FlatList
				data={products.filter((product) =>
					product.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)}
				renderItem={renderProduct}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
			/>
			<FAB
				style={styles.fab}
				icon='plus'
				onPress={() => navigation.navigate('AddProduct')}
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
	productImage: {
		height: 200,
		resizeMode: 'cover',
	},
});

export default ProductsScreen;
