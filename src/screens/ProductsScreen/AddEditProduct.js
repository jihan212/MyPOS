import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_STORAGE_KEY = '@mypos_products';

const AddEditProduct = ({ route, navigation }) => {
	const editProduct = route.params?.product;
	const [name, setName] = useState(editProduct?.name || '');
	const [price, setPrice] = useState(editProduct?.price?.toString() || '');
	const [stock, setStock] = useState(editProduct?.stock?.toString() || '');
	const [category, setCategory] = useState(editProduct?.category || '');
	const [image, setImage] = useState(editProduct?.imageUrl || null);
	const [loading, setLoading] = useState(false);

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

	const handleSave = async () => {
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
			const existingProductsJson = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
			let products = existingProductsJson ? JSON.parse(existingProductsJson) : [];

			if (editProduct) {
				// Update existing product
				products = products.map(p => 
					p.id === editProduct.id ? productData : p
				);
			} else {
				// Add new product
				productData.createdAt = new Date().toISOString();
				products.push(productData);
			}

			// Save updated products list
			await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
			navigation.goBack();
		} catch (error) {
			console.error('Error saving product:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Title style={styles.title}>
				{editProduct ? 'Edit Product' : 'Add New Product'}
			</Title>

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
			>
				{image ? 'Change Image' : 'Pick an Image'}
			</Button>

			<TextInput
				label='Product Name'
				value={name}
				onChangeText={setName}
				style={styles.input}
			/>
			<TextInput
				label='Price'
				value={price}
				onChangeText={setPrice}
				keyboardType='numeric'
				style={styles.input}
			/>
			<TextInput
				label='Stock'
				value={stock}
				onChangeText={setStock}
				keyboardType='numeric'
				style={styles.input}
			/>
			<TextInput
				label='Category'
				value={category}
				onChangeText={setCategory}
				style={styles.input}
			/>

			<Button
				mode='contained'
				onPress={handleSave}
				loading={loading}
				disabled={loading}
				style={styles.saveButton}
			>
				Save Product
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
	imagePreview: {
		width: '100%',
		height: 200,
		resizeMode: 'cover',
		marginBottom: 16,
		borderRadius: 8,
	},
	imageButton: {
		marginBottom: 16,
	},
	input: {
		marginBottom: 16,
	},
	saveButton: {
		marginTop: 16,
	},
});

export default AddEditProduct;
