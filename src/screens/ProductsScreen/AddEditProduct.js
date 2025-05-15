import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Button, TextInput, Title, Divider, List, Modal, Portal, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getData, saveData, STORAGE_KEYS } from '../../utils/dataStorage';
import { theme } from '../../constants/theme';

const AddEditProduct = ({ route, navigation }) => {
	// Create a fresh copy of the product object
	const productParam = route.params?.product;
	const editProduct = productParam ? JSON.parse(JSON.stringify(productParam)) : null;
	
	const [name, setName] = useState(editProduct?.name || '');
	const [price, setPrice] = useState(editProduct?.price?.toString() || '');
	const [stock, setStock] = useState(editProduct?.stock?.toString() || '');
	const [category, setCategory] = useState(editProduct?.category || '');
	const [categoryName, setCategoryName] = useState('');
	const [categoryColor, setCategoryColor] = useState('');
	const [image, setImage] = useState(editProduct?.imageUrl || null);
	const [loading, setLoading] = useState(false);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [errors, setErrors] = useState({});
	const [refreshing, setRefreshing] = useState(false);

	// Hide header
	useEffect(() => {
		navigation.setOptions({
			headerShown: false
		});
	}, [navigation]);

	// Load categories when component mounts
	useEffect(() => {
		loadCategories();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			await loadCategories();
		} finally {
			setRefreshing(false);
		}
	};

	const loadCategories = async () => {
		try {
			setCategoriesLoading(true);
			const categoriesData = await getData(STORAGE_KEYS.CATEGORIES);
			
			if (Array.isArray(categoriesData) && categoriesData.length > 0) {
				setCategories(categoriesData);
				
				// If editing, find the category info
				if (editProduct?.category) {
					const selectedCategory = categoriesData.find(c => c.id === editProduct.category);
					if (selectedCategory) {
						setCategoryName(selectedCategory.name);
						setCategoryColor(selectedCategory.color);
					}
				}
			}
		} catch (error) {
			console.error('Error loading categories:', error);
			Alert.alert('Error', 'Failed to load categories');
		} finally {
			setCategoriesLoading(false);
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const handleCategorySelect = (categoryId, name, color) => {
		setCategory(categoryId);
		setCategoryName(name);
		setCategoryColor(color);
		setCategoryModalVisible(false);
		// Clear category error if it exists
		if (errors.category) {
			setErrors({...errors, category: null});
		}
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!name.trim()) {
			newErrors.name = 'Product name is required';
		}
		
		if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
			newErrors.price = 'Valid price is required';
		}
		
		if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
			newErrors.stock = 'Valid stock quantity is required';
		}
		
		if (!category) {
			newErrors.category = 'Category is required';
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) {
			Alert.alert('Validation Error', 'Please correct the errors in the form');
			return;
		}
		
		try {
			setLoading(true);

			const productData = {
				id: editProduct?.id || Date.now().toString(),
				name,
				price: parseFloat(price),
				stock: parseInt(stock),
				category,
				imageUrl: image,
				updatedAt: new Date().toISOString(),
			};

			// Get existing products
			const products = await getData(STORAGE_KEYS.PRODUCTS) || [];

			if (editProduct) {
				// Update existing product
				const updatedProducts = products.map(p => 
					p.id === editProduct.id ? productData : p
				);
				await saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
			} else {
				// Add new product
				productData.createdAt = new Date().toISOString();
				await saveData(STORAGE_KEYS.PRODUCTS, [...products, productData]);
			}

			navigation.goBack();
		} catch (error) {
			console.error('Error saving product:', error);
			Alert.alert('Error', 'Failed to save product');
		} finally {
			setLoading(false);
		}
	};

	// No categories message component
	const NoCategoriesMessage = () => (
		<View style={styles.centered}>
			<Text style={styles.noDataText}>No categories available.</Text>
			<Button 
				mode="contained" 
				onPress={() => {
					setCategoryModalVisible(false);
					navigation.navigate('Categories');
				}}
				style={styles.actionButton}
			>
				Add Categories
			</Button>
		</View>
	);

	return (
		<ScrollView 
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={[theme.colors.primary]}
					tintColor={theme.colors.primary}
				/>
			}
		>
			<View style={styles.header}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					style={styles.backButton}
					mode="text"
				>
					Back
				</Button>
				<Title style={styles.screenTitle}>
				{editProduct ? 'Edit Product' : 'Add New Product'}
			</Title>
			</View>

			{image && (
				<Image
					source={{ uri: image }}
					style={styles.imagePreview}
				/>
			)}

			<Button
				mode='outlined'
				onPress={pickImage}
				style={styles.imageButton}
				icon="camera"
			>
				{image ? 'Change Image' : 'Select Image'}
			</Button>

			<TextInput
				label='Product Name *'
				value={name}
				onChangeText={setName}
				style={styles.input}
				error={!!errors.name}
			/>
			{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
			
			<TextInput
				label='Price *'
				value={price}
				onChangeText={setPrice}
				keyboardType='numeric'
				style={styles.input}
				error={!!errors.price}
			/>
			{errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
			
			<TextInput
				label='Stock *'
				value={stock}
				onChangeText={setStock}
				keyboardType='numeric'
				style={styles.input}
				error={!!errors.stock}
			/>
			{errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
			
			<View style={styles.categorySection}>
				<Text style={styles.sectionLabel}>Category *</Text>
				
				{categoriesLoading ? (
					<ActivityIndicator size="small" color={theme.colors.primary} style={styles.loader} />
				) : categories.length === 0 ? (
					<NoCategoriesMessage />
				) : (
					<View style={styles.categoryGrid}>
						{categories.map(cat => (
							<Button
								key={cat.id}
								mode={category === cat.id ? "contained" : "outlined"}
								onPress={() => handleCategorySelect(cat.id, cat.name, cat.color)}
								style={[
									styles.categoryChip,
									{ borderColor: cat.color },
									category === cat.id && { backgroundColor: cat.color }
								]}
								labelStyle={[
									styles.categoryLabel,
									category === cat.id && styles.selectedCategoryLabel
								]}
							>
								{cat.name}
							</Button>
						))}
					</View>
				)}
				
				{errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
				
				{!categoriesLoading && categories.length > 0 && (
					<Button
						mode="text"
						onPress={() => navigation.navigate('Categories')}
						style={styles.manageCategoriesButton}
					>
						Manage Categories
					</Button>
				)}
			</View>

			<Button
				mode='contained'
				onPress={handleSave}
				loading={loading}
				disabled={loading || categoriesLoading}
				style={styles.saveButton}
				icon="content-save"
			>
				Save Product
			</Button>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	contentContainer: {
		padding: 16,
		paddingTop: 40, // Add padding for status bar
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	backButton: {
		marginRight: 8,
	},
	screenTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: theme.colors.primary,
		flex: 1,
	},
	imagePreview: {
		width: '100%',
		height: 200,
		resizeMode: 'cover',
		marginBottom: 16,
		borderRadius: 8,
	},
	imageButton: {
		marginBottom: 20,
	},
	input: {
		marginBottom: 12,
	},
	categorySection: {
		marginTop: 8,
		marginBottom: 16,
	},
	sectionLabel: {
		fontSize: 16,
		marginBottom: 12,
		color: theme.colors.text,
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 8,
	},
	categoryChip: {
		margin: 4,
		borderWidth: 2,
	},
	categoryLabel: {
		fontSize: 12,
	},
	selectedCategoryLabel: {
		color: 'white',
	},
	manageCategoriesButton: {
		marginTop: 8,
		alignSelf: 'flex-start',
	},
	loader: {
		margin: 16,
	},
	centered: {
		alignItems: 'center',
		padding: 16,
	},
	noDataText: {
		marginBottom: 16,
		fontStyle: 'italic',
		color: theme.colors.placeholder,
	},
	actionButton: {
		marginVertical: 8,
	},
	saveButton: {
		marginTop: 16,
	},
	errorText: {
		color: theme.colors.error,
		fontSize: 12,
		marginBottom: 8,
		marginTop: -8,
	},
});

export default AddEditProduct;
