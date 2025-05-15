import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
	FAB,
	Searchbar,
	Card,
	Title,
	Paragraph,
	Button,
	Chip,
	ActivityIndicator,
	Surface,
	Menu,
	Text,
	IconButton
} from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getData, saveData, STORAGE_KEYS } from '../../utils/dataStorage';
import { theme } from '../../constants/theme';

const ProductsScreen = ({ navigation }) => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(false);
	const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
	const isFocused = useIsFocused();

	// Set up navigation options with category management button
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<IconButton
					icon="tag-plus"
					size={24}
					onPress={() => navigation.navigate('Categories')}
					style={{ marginRight: 8 }}
					color={theme.colors.primary}
				/>
			),
		});
	}, [navigation]);

	useEffect(() => {
		if (isFocused) {
			loadData();
		}
	}, [isFocused]);

  useEffect(() => {
		filterProducts();
	}, [searchQuery, selectedCategory, products]);

	const loadData = async () => {
    try {
			setLoading(true);
			const [productsData, categoriesData] = await Promise.all([
				getData(STORAGE_KEYS.PRODUCTS),
				getData(STORAGE_KEYS.CATEGORIES)
			]);

			if (Array.isArray(productsData)) {
      setProducts(productsData);
			}

			if (Array.isArray(categoriesData)) {
				setCategories(categoriesData);
			}
    } catch (error) {
			console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

	const filterProducts = () => {
		let filtered = [...products];
		
		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(product => 
				product.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter(product => product.category === selectedCategory);
		}
		
		setFilteredProducts(filtered);
	};

	const getCategoryInfo = (categoryId) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category || { name: 'Uncategorized', color: '#bbbbbb' };
	};

	const handleDelete = async (productId) => {
		try {
			const updatedProducts = products.filter((product) => product.id !== productId);
			await saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
			setProducts(updatedProducts);
		} catch (error) {
			console.error('Error deleting product:', error);
		}
	};

	const resetCategoryFilter = () => {
		setSelectedCategory(null);
		setCategoryMenuVisible(false);
	};

	const renderProduct = ({ item }) => {
		const categoryInfo = getCategoryInfo(item.category);
		console.log(`Product '${item.name}' has category ID: '${item.category}'`);
		console.log(`Found category info:`, categoryInfo);
		
		return (
		<Card style={styles.card}>
			{item.imageUrl && (
				<Card.Cover
					source={{ uri: item.imageUrl }}
					style={styles.productImage}
				/>
			)}
			<Card.Content>
				<Title>{item.name}</Title>
					<View style={styles.productDetails}>
				<Paragraph>Price: ${item.price}</Paragraph>
				<Paragraph>Stock: {item.stock}</Paragraph>
						<View style={styles.categoryContainer}>
							<View style={[styles.categoryDot, { backgroundColor: categoryInfo.color }]} />
							<Paragraph>{categoryInfo.name}</Paragraph>
						</View>
					</View>
			</Card.Content>
			<Card.Actions>
				<Button
						onPress={() => {
							console.log("Navigating to EditProduct with:", { ...item });
							navigation.navigate('EditProduct', { product: item });
						}}
				>
					Edit
				</Button>
				<Button onPress={() => handleDelete(item.id)}>Delete</Button>
			</Card.Actions>
		</Card>
	);
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.filterContainer}>
			<Searchbar
				placeholder='Search products'
				onChangeText={setSearchQuery}
				value={searchQuery}
				style={styles.searchBar}
			/>
				
				<Menu
					visible={categoryMenuVisible}
					onDismiss={() => setCategoryMenuVisible(false)}
					anchor={
						<Button 
							mode="outlined" 
							onPress={() => setCategoryMenuVisible(true)}
							style={styles.filterButton}
						>
							{selectedCategory 
								? `Category: ${getCategoryInfo(selectedCategory).name}` 
								: 'Filter by Category'}
						</Button>
					}
				>
					<Menu.Item onPress={resetCategoryFilter} title="All Categories" />
					<View style={styles.divider} />
					{categories.map(category => (
						<Menu.Item
							key={category.id}
							onPress={() => {
								setSelectedCategory(category.id);
								setCategoryMenuVisible(false);
							}}
							title={category.name}
							style={{ backgroundColor: selectedCategory === category.id ? '#f0f0f0' : 'transparent' }}
							titleStyle={{ color: 'black' }}
							left={() => <View style={[styles.menuCategoryDot, { backgroundColor: category.color }]} />}
						/>
					))}
				</Menu>
				
				{selectedCategory && (
					<Button 
						icon="close" 
						mode="text" 
						onPress={resetCategoryFilter}
						style={styles.clearButton}
					>
						Clear filter
					</Button>
				)}
			</View>
			
			<FlatList
				data={filteredProducts}
				renderItem={renderProduct}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={
					<Card style={styles.emptyCard}>
						<Card.Content>
							<Text style={styles.emptyText}>
								{searchQuery || selectedCategory 
									? 'No products match your filters' 
									: 'No products added yet'}
							</Text>
						</Card.Content>
					</Card>
				}
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
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterContainer: {
		padding: 16,
		paddingBottom: 0,
	},
	searchBar: {
		marginBottom: 8,
		elevation: 2,
	},
	filterButton: {
		marginBottom: 8,
	},
	clearButton: {
		marginBottom: 8,
	},
	listContainer: {
		padding: 16,
		paddingBottom: 80,
	},
	card: {
		marginBottom: 16,
		elevation: 2,
	},
	productDetails: {
		marginTop: 8,
	},
	categoryContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
	},
	categoryDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	menuCategoryDot: {
		width: 20,
		height: 20,
		borderRadius: 10,
		marginLeft: 8,
	},
	divider: {
		height: 1,
		backgroundColor: '#e0e0e0',
		marginVertical: 4,
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
	emptyCard: {
		padding: 16,
		marginTop: 16,
	},
	emptyText: {
		textAlign: 'center',
		color: theme.colors.placeholder,
		fontStyle: 'italic',
	},
});

export default ProductsScreen;
