import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
	TextInput,
	Button,
	Title,
	Text,
	Portal,
	Modal,
	List,
	Divider,
	ActivityIndicator,
	Card,
	IconButton,
	Snackbar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const SALES_STORAGE_KEY = '@mypos_sales';
const PRODUCTS_STORAGE_KEY = '@mypos_products';
const CUSTOMERS_STORAGE_KEY = '@mypos_customers';
const LOW_STOCK_THRESHOLD = 10;

const SalesScreen = () => {
	const navigation = useNavigation();
	const [cart, setCart] = useState([]);
	const [products, setProducts] = useState([]);
	const [customers, setCustomers] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [customerModalVisible, setCustomerModalVisible] = useState(false);
	const [productsModalVisible, setProductsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [lastCompletedSale, setLastCompletedSale] = useState(null);
	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			const [productsData, customersData] = await Promise.all([
				AsyncStorage.getItem(PRODUCTS_STORAGE_KEY),
				AsyncStorage.getItem(CUSTOMERS_STORAGE_KEY),
			]);

			if (productsData) setProducts(JSON.parse(productsData));
			if (customersData) setCustomers(JSON.parse(customersData));
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		loadData().then(() => setRefreshing(false));
	}, []);

	const handleCancel = () => {
		setCart([]);
		setSelectedCustomer(null);
	};

	const getUpdatedStock = (productId, additionalQuantity = 0) => {
		const cartItem = cart.find(item => item.id === productId);
		const product = products.find(p => p.id === productId);
		if (!cartItem || !product) return product?.stock || 0;
		return product.stock - (cartItem.quantity + additionalQuantity);
	};

	const checkLowStock = (productId) => {
		const currentStock = getUpdatedStock(productId);
		return currentStock < LOW_STOCK_THRESHOLD;
	};

	const addToCart = (product) => {
		const existingItem = cart.find(item => item.id === product.id);
		const newQty = (existingItem?.quantity || 0) + 1;
		const updatedStock = getUpdatedStock(product.id, 1);

		if (updatedStock < LOW_STOCK_THRESHOLD) {
			setSnackbarMessage(`${product.name} low stock alert: ${updatedStock} units`);
			setSnackbarVisible(true);
		}

		setCart(currentCart => {
			const existingItem = currentCart.find(item => item.id === product.id);
			if (existingItem) {
				return currentCart.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...currentCart, { ...product, quantity: 1 }];
		});
		setProductsModalVisible(false);
	};

	const removeFromCart = (productId) => {
		const product = products.find(p => p.id === productId);
		const cartItem = cart.find(item => item.id === productId);
		const updatedStock = getUpdatedStock(productId) + (cartItem?.quantity || 0);
		
		// Only show notification if removing item will still result in low stock
		if (product && cartItem && updatedStock < LOW_STOCK_THRESHOLD) {
			setSnackbarMessage(`Removed ${cartItem.quantity} ${product.name}${cartItem.quantity > 1 ? 's' : ''} - Stock level: ${updatedStock} units`);
			setSnackbarVisible(true);
		}
		
		setCart(currentCart => currentCart.filter(item => item.id !== productId));
	};

	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		
		const product = products.find(p => p.id === productId);
		if (!product) return;

		// Calculate new stock after quantity update
		const currentCartItem = cart.find(item => item.id === productId);
		const stockChange = newQuantity - (currentCartItem?.quantity || 0);
		const updatedStock = product.stock - newQuantity;

		if (updatedStock < 0) {
			setSnackbarMessage(`Cannot update: Only ${product.stock} units available for ${product.name}`);
			setSnackbarVisible(true);
			return;
		}

		setCart(currentCart =>
			currentCart.map(item =>
				item.id === productId
					? { ...item, quantity: newQuantity }
					: item
			)
		);

		// Only show notification for low stock
		if (updatedStock < LOW_STOCK_THRESHOLD) {
			setSnackbarMessage(`${product.name} low stock alert: ${updatedStock} units`);
			setSnackbarVisible(true);
		}
	};

	const calculateDiscount = () => {
		if (!selectedCustomer) return 0;
		return selectedCustomer.totalPaidAmount >= 10000 ? 0.05 : 0; // 5% discount if total paid >= 10000
	};

	const calculateTotal = () => {
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		const discount = calculateDiscount();
		return (subtotal * (1 - discount)).toFixed(2);
	};

	const getDiscountAmount = () => {
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		const discount = calculateDiscount();
		return (subtotal * discount).toFixed(2);
	};

	const completeSale = async () => {
		if (!selectedCustomer || cart.length === 0) {
			alert('Please select a customer and add products to cart');
			return;
		}

		try {
			setLoading(true);
			const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const discount = calculateDiscount();
			const discountAmount = subtotal * discount;
			const total = subtotal - discountAmount;

			const sale = {
				id: Date.now().toString(),
				customerId: selectedCustomer.id,
				customerName: selectedCustomer.name,
				items: cart,
				subtotal: subtotal,
				discountPercent: discount * 100,
				discountAmount: discountAmount,
				total: total,
				date: new Date().toISOString(),
			};

			// Update sales history
			const salesData = await AsyncStorage.getItem(SALES_STORAGE_KEY);
			const sales = salesData ? JSON.parse(salesData) : [];
			await AsyncStorage.setItem(
				SALES_STORAGE_KEY,
				JSON.stringify([...sales, sale])
			);

			// Update product stock
			const updatedProducts = products.map(product => {
				const cartItem = cart.find(item => item.id === product.id);
				if (cartItem) {
					return {
						...product,
						stock: product.stock - cartItem.quantity,
					};
				}
				return product;
			});
			await AsyncStorage.setItem(
				PRODUCTS_STORAGE_KEY,
				JSON.stringify(updatedProducts)
			);

			// Update customer's total paid amount and orders
			const customersData = await AsyncStorage.getItem(CUSTOMERS_STORAGE_KEY);
			const customers = JSON.parse(customersData);
			const updatedCustomers = customers.map(customer =>
				customer.id === selectedCustomer.id
					? {
						...customer,
						totalOrders: (customer.totalOrders || 0) + 1,
						totalPaidAmount: (customer.totalPaidAmount || 0) + total,
					}
					: customer
			);
			await AsyncStorage.setItem(
				CUSTOMERS_STORAGE_KEY,
				JSON.stringify(updatedCustomers)
			);

			setLastCompletedSale(sale);
			setSuccessModalVisible(true);

			// Reset cart and selected customer
			setCart([]);
			setSelectedCustomer(null);
			setProducts(updatedProducts);
			setCustomers(updatedCustomers);

			// Navigate to Invoices screen and trigger reload
			navigation.navigate('Invoices', { reload: Date.now() });
		} catch (error) {
			console.error('Error completing sale:', error);
			alert('Error completing sale. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<ScrollView 
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<Card style={styles.mainCard}>
				<Card.Content>
					<Title style={styles.title}>Create Invoice</Title>

					<View style={styles.customerSection}>
						<Button
							mode="outlined"
							onPress={() => setCustomerModalVisible(true)}
							style={styles.customerButton}
						>
							{selectedCustomer ? selectedCustomer.name : 'Select Customer'}
						</Button>
					</View>

					<Divider style={styles.divider} />

					<View style={styles.itemsSection}>
						<Button
							mode="outlined"
							onPress={() => setProductsModalVisible(true)}
							style={styles.addItemButton}
							icon="plus"
						>
							Add Item
						</Button>

						{cart.map((item) => (
							<View key={item.id} style={styles.cartItem}>
								<View style={styles.itemDetails}>
									<Text style={styles.itemName}>{item.name}</Text>
									<Text style={styles.itemPrice}>
										${item.price.toFixed(2)} x {item.quantity}
									</Text>
									{checkLowStock(item.id) && (
										<Text style={styles.lowStockWarning}>
											Low stock: {getUpdatedStock(item.id)} units left
										</Text>
									)}
								</View>
								<View style={styles.quantityControl}>
									<IconButton
										icon="minus"
										size={20}
										onPress={() => updateQuantity(item.id, item.quantity - 1)}
									/>
									<Text>{item.quantity}</Text>
									<IconButton
										icon="plus"
										size={20}
										onPress={() => updateQuantity(item.id, item.quantity + 1)}
										disabled={item.quantity >= getUpdatedStock(item.id)}
									/>
									<IconButton
										icon="delete"
										size={20}
										onPress={() => removeFromCart(item.id)}
									/>
								</View>
							</View>
						))}
					</View>

					<Divider style={styles.divider} />

					<View style={styles.totalSection}>
						<Text style={styles.totalLabel}>Total</Text>
						<Text style={styles.totalAmount}>${calculateTotal()}</Text>
					</View>

					<View style={styles.buttonContainer}>
						<Button
							mode="contained"
							onPress={completeSale}
							disabled={cart.length === 0 || !selectedCustomer}
							style={styles.generateButton}
						>
							Generate Invoice
						</Button>
						<Button
							mode="outlined"
							onPress={handleCancel}
							style={styles.cancelButton}
							disabled={cart.length === 0 && !selectedCustomer}
						>
							Cancel
						</Button>
					</View>
				</Card.Content>
			</Card>

			<Portal>
				<Modal
					visible={customerModalVisible}
					onDismiss={() => setCustomerModalVisible(false)}
					contentContainerStyle={styles.modalContent}
				>
					<Title>Select Customer</Title>
					<ScrollView>
						{customers.map(customer => (
							<List.Item
								key={customer.id}
								title={customer.name}
								description={customer.email}
								onPress={() => {
									setSelectedCustomer(customer);
									setCustomerModalVisible(false);
								}}
							/>
						))}
					</ScrollView>
				</Modal>

				<Modal
					visible={productsModalVisible}
					onDismiss={() => setProductsModalVisible(false)}
					contentContainerStyle={styles.modalContent}
				>
					<Title>Select Product</Title>
					<ScrollView>
						{products.map(product => {
							const updatedStock = getUpdatedStock(product.id);
							const isLowStock = updatedStock < LOW_STOCK_THRESHOLD;
							return (
								<List.Item
									key={product.id}
									title={product.name}
									description={
										<>
											<Text>${product.price.toFixed(2)} - Stock: {updatedStock}</Text>
											{isLowStock && (
												<Text style={styles.lowStockWarning}>
													{'\n'}{product.name} low stock alert: {updatedStock} units
												</Text>
											)}
										</>
									}
									onPress={() => addToCart(product)}
									disabled={updatedStock < 1}
									titleStyle={isLowStock ? styles.lowStockText : null}
								/>
							);
						})}
					</ScrollView>
				</Modal>
			</Portal>

			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={3000}
				style={styles.snackbar}
				theme={{
					colors: {
						surface: '#FF0000',
						onSurface: '#FFFFFF'
					}
				}}
			>
				{snackbarMessage}
			</Snackbar>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	mainCard: {
		margin: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	customerSection: {
		marginBottom: 16,
	},
	customerButton: {
		width: '100%',
	},
	divider: {
		marginVertical: 16,
	},
	itemsSection: {
		marginBottom: 16,
	},
	addItemButton: {
		marginBottom: 16,
	},
	cartItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border,
	},
	itemDetails: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		marginBottom: 4,
	},
	itemPrice: {
		color: theme.colors.textLight,
	},
	quantityControl: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	totalSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: 'bold',
		color: theme.colors.primary,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
	},
	generateButton: {
		flex: 1,
		marginRight: 8,
	},
	cancelButton: {
		flex: 1,
		marginLeft: 8,
	},
	modalContent: {
		backgroundColor: theme.colors.background,
		padding: 20,
		margin: 20,
		maxHeight: '80%',
		borderRadius: 8,
	},
	lowStockWarning: {
		color: '#FF0000',
		fontSize: 12,
		marginTop: 4,
		fontWeight: 'bold',
	},
	lowStockText: {
		color: '#FF0000',
		fontWeight: 'bold',
	},
	snackbar: {
		backgroundColor: '#FF0000',
	},
});

export default SalesScreen;
