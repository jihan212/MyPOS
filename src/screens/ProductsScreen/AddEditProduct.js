import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../firebase';

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
			let imageUrl = image;

			// Upload image if it's a new image (not a URL)
			if (image && !image.startsWith('http')) {
				const storage = getStorage();
				const imageRef = ref(storage, `products/${Date.now()}.jpg`);

				const response = await fetch(image);
				const blob = await response.blob();
				await uploadBytes(imageRef, blob);
				imageUrl = await getDownloadURL(imageRef);
			}

			const productData = {
				name,
				price: parseFloat(price),
				stock: parseInt(stock),
				category,
				imageUrl,
				updatedAt: new Date(),
			};

			if (editProduct) {
				await updateDoc(
					doc(db, 'products', editProduct.id),
					productData
				);
			} else {
				await addDoc(collection(db, 'products'), {
					...productData,
					createdAt: new Date(),
				});
			}

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
