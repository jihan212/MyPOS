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
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const ProductsScreen = () => {
	const [products, setProducts] = useState([
		{
			id: '1',
			name: 'iPhone 14 Pro',
			price: 999.99,
			stock: 50,
			category: 'Electronics',
			imageUrl:
				'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop',
		},
		{
			id: '2',
			name: 'MacBook Air M2',
			price: 1299.99,
			stock: 30,
			category: 'Computers',
			imageUrl:
				'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
		},
		{
			id: '3',
			name: 'AirPods Pro',
			price: 249.99,
			stock: 100,
			category: 'Accessories',
			imageUrl:
				'https://images.unsplash.com/photo-1588156979435-379b9d802921?w=800&auto=format&fit=crop',
		},
		{
			id: '4',
			name: 'iPad Pro 12.9"',
			price: 1099.99,
			stock: 25,
			category: 'Tablets',
			imageUrl:
				'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop',
		},
	]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	// Remove or comment out the useEffect and fetchProducts function since we're using demo data
	/*
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  */

	const handleDelete = async (productId) => {
		try {
			await deleteDoc(doc(db, 'products', productId));
			setProducts(products.filter((product) => product.id !== productId));
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
